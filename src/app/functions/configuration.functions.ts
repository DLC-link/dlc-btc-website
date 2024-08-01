import { WalletType } from '@models/wallet';
import { supportedEthereumNetworks } from 'dlc-btc-lib/constants';
import { getEthereumContract, getProvider } from 'dlc-btc-lib/ethereum-functions';
import { EthereumDeploymentPlan, EthereumNetwork, EthereumNetworkID } from 'dlc-btc-lib/models';
import { Contract } from 'ethers';
import { filter, fromPairs, includes, map, pipe } from 'ramda';
import { Chain, HttpTransport, http } from 'viem';
import { Config, createConfig } from 'wagmi';

import { SUPPORTED_VIEM_CHAINS } from '@shared/constants/ethereum.constants';

import { getEthereumSigner } from './ethereum-account.functions';

export function getEthereumNetworkDeploymentPlans(
  ethereumNetwork: EthereumNetwork
): EthereumDeploymentPlan[] {
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
  ethereumNetwork: EthereumNetwork,
  contractName: string,
  rpcEndpoint?: string
): Contract {
  return getEthereumContract(
    contractDeploymentPlans,
    contractName,
    getProvider(rpcEndpoint ?? ethereumNetwork.defaultNodeURL)
  );
}

export async function getEthereumContractWithSigner(
  contractDeploymentPlans: EthereumDeploymentPlan[],
  contractName: string,
  walletType: WalletType,
  ethereumNetwork: EthereumNetwork
): Promise<Contract> {
  return getEthereumContract(
    contractDeploymentPlans,
    contractName,
    await getEthereumSigner(walletType, ethereumNetwork)
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
  });
}
