import { useMemo } from 'react';

import { supportedEthereumNetworks } from 'dlc-btc-lib/constants';
import { getEthereumContract, getProvider } from 'dlc-btc-lib/ethereum-functions';
import { EthereumDeploymentPlan, EthereumNetwork, EthereumNetworkID } from 'dlc-btc-lib/models';
import { Contract, ethers, providers } from 'ethers';
import { filter, fromPairs, includes, map, pipe } from 'ramda';
import { Account, Chain, Client, HttpTransport, Transport, http } from 'viem';
import { Config, createConfig, useConnectorClient } from 'wagmi';

import { SUPPORTED_VIEM_CHAINS } from '@shared/constants/ethereum.constants';

const abi = ['function totalSupply() view returns (uint256)'];
const provider = new ethers.providers.StaticJsonRpcProvider(appConfiguration.l1HTTP);
export const mainnetContract = new ethers.Contract(
  '0x20157DBAbb84e3BBFE68C349d0d44E48AE7B5AD2',
  abi,
  provider
);

export function getEthereumNetworkDeploymentPlans(ethereumChain: Chain): EthereumDeploymentPlan[] {
  const ethereumNetwork: EthereumNetwork | undefined = supportedEthereumNetworks.find(
    network => network.id === (ethereumChain.id.toString() as EthereumNetworkID)
  );

  if (!ethereumNetwork) {
    throw new Error(`Unsupported Ethereum network: ${ethereumChain.id}`);
  }

  const ethereumNetworkDeploymentPlans: EthereumDeploymentPlan[] | undefined =
    appConfiguration.ethereumContractInformations.find(
      (networkDeploymenPlans: { name: string; deploymentPlans: EthereumDeploymentPlan[] }) =>
        networkDeploymenPlans.name === ethereumNetwork.name
    )?.deploymentPlans;

  if (!ethereumNetworkDeploymentPlans) {
    throw new Error(`Ethereum Network not supported: ${ethereumNetwork.id}`);
  }

  return ethereumNetworkDeploymentPlans;
}

export function getEthereumNetworkByID(ethereumNetworkID: EthereumNetworkID): EthereumNetwork {
  const ethereumNetwork = supportedEthereumNetworks.find(
    network => network.id === ethereumNetworkID
  );
  if (!ethereumNetwork) {
    throw new Error(`Unsupported Ethereum network: ${ethereumNetworkID}`);
  }
  return ethereumNetwork;
}

export function getEthereumContractWithProvider(
  contractDeploymentPlans: EthereumDeploymentPlan[],
  ethereumNetwork: Chain,
  contractName: string,
  rpcEndpoint?: string
): Contract {
  return getEthereumContract(
    contractDeploymentPlans,
    contractName,
    getProvider(rpcEndpoint ?? ethereumNetwork.rpcUrls.default.http[0])
  );
}

export function getWagmiConfiguration(ethereumNetworkIDs: EthereumNetworkID[]): Config {
  const wagmiChains = filter(
    (chain: Chain) => includes(chain.id, map(Number, ethereumNetworkIDs)),
    SUPPORTED_VIEM_CHAINS
  ) as [Chain, ...Chain[]];

  const wagmiTransports = pipe(
    map((chain: Chain): [number, HttpTransport] => [chain.id, http()]),
    fromPairs
  )(wagmiChains);

  return createConfig({
    chains: wagmiChains,
    transports: wagmiTransports,
    connectors: [],
  });
}

export const isEnabledEthereumNetwork = (chain: Chain): boolean => {
  return appConfiguration.enabledEthereumNetworkIDs.includes(
    chain.id.toString() as EthereumNetworkID
  );
};

function clientToSigner(client: Client<Transport, Chain, Account>): providers.JsonRpcSigner {
  const { account, chain, transport } = client;

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  return new providers.Web3Provider(transport, network).getSigner(account.address);
}

export function useEthersSigner({ chainId }: { chainId?: number } = {}):
  | providers.JsonRpcSigner
  | undefined {
  const { data: client } = useConnectorClient<Config>({ chainId });
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}
