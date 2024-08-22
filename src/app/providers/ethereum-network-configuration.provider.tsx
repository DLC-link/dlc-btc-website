import React, { createContext } from 'react';

import {
  getEthereumContractWithProvider,
  getEthereumContractWithSigner,
  getEthereumNetworkByID,
  getEthereumNetworkDeploymentPlans,
  isEnabledEthereumNetwork,
  useEthersSigner,
} from '@functions/configuration.functions';
import { EthereumNetworkConfiguration } from '@models/ethereum-models';
import { HasChildren } from '@models/has-children';
import { useQuery } from '@tanstack/react-query';
import { EthereumNetworkID } from 'dlc-btc-lib/models';
import { Contract } from 'ethers';
import { defaultTo, equals, find } from 'ramda';
import { Chain } from 'viem';
import { useAccount } from 'wagmi';

import { SUPPORTED_VIEM_CHAINS } from '@shared/constants/ethereum.constants';

interface EthereumNetworkConfigurationContext extends EthereumNetworkConfiguration {
  getReadOnlyDLCManagerContract: (rpcEndpoint?: string) => Contract;
  getReadOnlyDLCBTCContract: (rpcEndpoint?: string) => Contract;
  getDLCManagerContract: (rpcEndpoint?: string) => Promise<Contract>;
  defaultEthereumNetwork: Chain;
}

const defaultEthereumNetwork = (() => {
  const defaultNetwork = find(
    chain => equals(chain.id, Number(appConfiguration.enabledEthereumNetworkIDs.at(0))),
    SUPPORTED_VIEM_CHAINS
  );
  if (!defaultNetwork) {
    throw new Error('Default Ethereum Network not found');
  }
  return defaultNetwork;
})();

const commonEthereumNetworkConfigurationFields = {
  enabledEthereumNetworks: appConfiguration.enabledEthereumNetworkIDs.map(id =>
    getEthereumNetworkByID(id)
  ),
  ethereumContractDeploymentPlans: getEthereumNetworkDeploymentPlans(defaultEthereumNetwork),
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
    ethereumAttestorChainID: 'evm-hardhat-arb',
    ...commonEthereumNetworkConfigurationFields,
  },
};

const defaultEthereumNetworkConfiguration = {
  ethereumExplorerAPIURL:
    ethereumNetworkConfigurationMap[defaultEthereumNetwork.id].ethereumExplorerAPIURL,
  ethereumAttestorChainID:
    ethereumNetworkConfigurationMap[defaultEthereumNetwork.id].ethereumAttestorChainID,
  enabledEthereumNetworks:
    ethereumNetworkConfigurationMap[defaultEthereumNetwork.id].enabledEthereumNetworks,
  ethereumContractDeploymentPlans:
    ethereumNetworkConfigurationMap[defaultEthereumNetwork.id].ethereumContractDeploymentPlans,
};

export const EthereumNetworkConfigurationContext =
  createContext<EthereumNetworkConfigurationContext>({
    ...defaultEthereumNetworkConfiguration,
    getDLCManagerContract: () => {
      throw new Error('Signer is not yet available to get the Contract with Signer');
    },
    getReadOnlyDLCManagerContract: (rpcEndpoint?: string) =>
      getEthereumContractWithProvider(
        defaultEthereumNetworkConfiguration.ethereumContractDeploymentPlans,
        defaultEthereumNetwork,
        'DLCManager',
        defaultTo(defaultEthereumNetwork?.rpcUrls.default.http[0], rpcEndpoint)
      ),
    getReadOnlyDLCBTCContract: (rpcEndpoint?: string) =>
      getEthereumContractWithProvider(
        defaultEthereumNetworkConfiguration.ethereumContractDeploymentPlans,
        defaultEthereumNetwork,
        'DLCBTC',
        defaultTo(defaultEthereumNetwork?.rpcUrls.default.http[0], rpcEndpoint)
      ),
    defaultEthereumNetwork,
  });

export function EthereumNetworkConfigurationContextProvider({
  children,
}: HasChildren): React.JSX.Element {
  const { chain } = useAccount();

  const ethersSigner = useEthersSigner();

  const { data: ethereumNetworkConfiguration = defaultEthereumNetworkConfiguration } = useQuery({
    enabled: !!chain && isEnabledEthereumNetwork(chain),
    queryKey: [`ethereumNetworkConfiguration-${chain?.id}`],
    queryFn: () => getEthereumNetworkConfiguration(chain?.id),
  });

  function getEthereumNetworkConfiguration(
    ethereumNetworkID?: number
  ): EthereumNetworkConfiguration {
    if (!ethereumNetworkID) {
      throw new Error(
        'Ethereum Network ID is not available to get the Ethereum Network Configuration'
      );
    }
    return {
      ethereumExplorerAPIURL:
        ethereumNetworkConfigurationMap[ethereumNetworkID].ethereumExplorerAPIURL,
      ethereumAttestorChainID:
        ethereumNetworkConfigurationMap[ethereumNetworkID].ethereumAttestorChainID,
      enabledEthereumNetworks:
        ethereumNetworkConfigurationMap[ethereumNetworkID].enabledEthereumNetworks,
      ethereumContractDeploymentPlans:
        ethereumNetworkConfigurationMap[ethereumNetworkID].ethereumContractDeploymentPlans,
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
        getReadOnlyDLCManagerContract: (rpcEndpoint?: string) => {
          return getEthereumContractWithProvider(
            ethereumNetworkConfiguration.ethereumContractDeploymentPlans,
            chain ?? defaultEthereumNetwork,
            'DLCManager',
            defaultTo(chain?.rpcUrls.default.http[0], rpcEndpoint)
          );
        },
        getReadOnlyDLCBTCContract: (rpcEndpoint?: string) => {
          return getEthereumContractWithProvider(
            ethereumNetworkConfiguration.ethereumContractDeploymentPlans,
            chain ?? defaultEthereumNetwork,
            'DLCBTC',
            defaultTo(chain?.rpcUrls.default.http[0], rpcEndpoint)
          );
        },
        getDLCManagerContract: async () => {
          return getEthereumContractWithSigner(
            ethereumNetworkConfiguration.ethereumContractDeploymentPlans,
            'DLCManager',
            ethersSigner!
          );
        },
        defaultEthereumNetwork,
      }}
    >
      {children}
    </EthereumNetworkConfigurationContext.Provider>
  );
}
