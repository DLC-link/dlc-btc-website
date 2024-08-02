import React, { createContext } from 'react';

import {
  getEthereumContractWithProvider,
  getEthereumContractWithSigner,
  getEthereumNetworkByID,
  getEthereumNetworkDeploymentPlans,
  useEthersSigner,
} from '@functions/configuration.functions';
import { EthereumNetworkConfiguration } from '@models/ethereum-models';
import { HasChildren } from '@models/has-children';
import { useQuery } from '@tanstack/react-query';
import { EthereumNetworkID } from 'dlc-btc-lib/models';
import { Contract } from 'ethers';
import { defaultTo, find, propEq } from 'ramda';
import { useAccount } from 'wagmi';

import { SUPPORTED_VIEM_CHAINS } from '@shared/constants/ethereum.constants';

interface EthereumNetworkConfigurationContext extends EthereumNetworkConfiguration {
  getReadOnlyDLCManagerContract: (rpcEndpoint?: string) => Contract;
  getReadOnlyDLCBTCContract: (rpcEndpoint?: string) => Contract;
  getDLCManagerContract: (rpcEndpoint?: string) => Promise<Contract>;
}
const defaultEthereumNetwork = find(
  propEq('id', Number(appConfiguration.enabledEthereumNetworkIDs.at(0))),
  SUPPORTED_VIEM_CHAINS
);

const commonEthereumNetworkConfigurationFields = {
  enabledEthereumNetworks: appConfiguration.enabledEthereumNetworkIDs.map(id =>
    getEthereumNetworkByID(id)
  ),
  ethereumContractDeploymentPlans: getEthereumNetworkDeploymentPlans(defaultEthereumNetwork!),
};

const ethereumNetworkConfigurationMap: Record<number, EthereumNetworkConfiguration> = {
  [EthereumNetworkID.ArbitrumSepolia]: {
    ethereumExplorerAPIURL: 'https://sepolia.arbiscan.io',
    ethereumAttestorChainID: 'evm-arbsepolia',
    ...commonEthereumNetworkConfigurationFields,
  },
  [EthereumNetworkID.Arbitrum]: {
    ethereumExplorerAPIURL: 'https://arbiscan.io',
    ethereumAttestorChainID: 'evm-arbitrum',
    ...commonEthereumNetworkConfigurationFields,
  },
  [EthereumNetworkID.Hardhat]: {
    ethereumExplorerAPIURL: 'https://arbiscan.io',
    ethereumAttestorChainID: 'evm-localhost',
    ...commonEthereumNetworkConfigurationFields,
  },
};

const defaultEthereumNetworkConfiguration = {
  ethereumExplorerAPIURL:
    ethereumNetworkConfigurationMap[defaultEthereumNetwork!.id].ethereumExplorerAPIURL,
  ethereumAttestorChainID:
    ethereumNetworkConfigurationMap[defaultEthereumNetwork!.id].ethereumAttestorChainID,
  enabledEthereumNetworks:
    ethereumNetworkConfigurationMap[defaultEthereumNetwork!.id].enabledEthereumNetworks,
  ethereumContractDeploymentPlans:
    ethereumNetworkConfigurationMap[defaultEthereumNetwork!.id].ethereumContractDeploymentPlans,
};

export const EthereumNetworkConfigurationContext =
  createContext<EthereumNetworkConfigurationContext>({
    ...defaultEthereumNetworkConfiguration,
    getDLCManagerContract: () => {
      throw new Error('Signer is not yet available to get the contract with signer');
    },
    getReadOnlyDLCManagerContract: (rpcEndpoint?: string) =>
      getEthereumContractWithProvider(
        defaultEthereumNetworkConfiguration.ethereumContractDeploymentPlans,
        defaultEthereumNetwork!,
        'DLCManager',
        defaultTo(defaultEthereumNetwork?.rpcUrls.default.http[0], rpcEndpoint)
      ),
    getReadOnlyDLCBTCContract: (rpcEndpoint?: string) =>
      getEthereumContractWithProvider(
        defaultEthereumNetworkConfiguration.ethereumContractDeploymentPlans,
        defaultEthereumNetwork!,
        'DLCBTC',
        defaultTo(defaultEthereumNetwork?.rpcUrls.default.http[0], rpcEndpoint)
      ),
  });

export function EthereumNetworkConfigurationContextProvider({
  children,
}: HasChildren): React.JSX.Element {
  const { chain } = useAccount();
  const ethersSigner = useEthersSigner();

  const { data: ethereumNetworkConfiguration = defaultEthereumNetworkConfiguration } = useQuery({
    queryKey: [`ethereumNetworkConfiguration-${chain!.id}`],
    queryFn: getEthereumNetworkConfiguration,
  });

  function getEthereumNetworkConfiguration(): EthereumNetworkConfiguration {
    return {
      ethereumExplorerAPIURL: ethereumNetworkConfigurationMap[chain!.id].ethereumExplorerAPIURL,
      ethereumAttestorChainID: ethereumNetworkConfigurationMap[chain!.id].ethereumAttestorChainID,
      enabledEthereumNetworks: ethereumNetworkConfigurationMap[chain!.id].enabledEthereumNetworks,
      ethereumContractDeploymentPlans:
        ethereumNetworkConfigurationMap[chain!.id].ethereumContractDeploymentPlans,
    };
  }

  return (
    <EthereumNetworkConfigurationContext.Provider
      value={{
        ethereumExplorerAPIURL: ethereumNetworkConfiguration.ethereumExplorerAPIURL,
        ethereumContractDeploymentPlans:
          ethereumNetworkConfiguration.ethereumContractDeploymentPlans,
        ethereumAttestorChainID: ethereumNetworkConfiguration.ethereumAttestorChainID,
        enabledEthereumNetworks: ethereumNetworkConfiguration.enabledEthereumNetworks,
        getReadOnlyDLCManagerContract: (rpcEndpoint?: string) =>
          getEthereumContractWithProvider(
            ethereumNetworkConfiguration.ethereumContractDeploymentPlans,
            chain!,
            'DLCManager',
            defaultTo(chain?.rpcUrls.default.http[0], rpcEndpoint)
          ),
        getReadOnlyDLCBTCContract: (rpcEndpoint?: string) =>
          getEthereumContractWithProvider(
            ethereumNetworkConfiguration.ethereumContractDeploymentPlans,
            chain!,
            'DLCBTC',
            defaultTo(chain?.rpcUrls.default.http[0], rpcEndpoint)
          ),
        getDLCManagerContract: async () =>
          getEthereumContractWithSigner(
            ethereumNetworkConfiguration.ethereumContractDeploymentPlans,
            'DLCManager',
            ethersSigner!
          ),
      }}
    >
      {children}
    </EthereumNetworkConfigurationContext.Provider>
  );
}
