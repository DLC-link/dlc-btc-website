import React, { createContext, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import {
  getEthereumContractWithProvider,
  getEthereumContractWithSigner,
  getEthereumNetworkByID,
  getEthereumNetworkDeploymentPlans,
} from '@functions/configuration.functions';
import {
  EthereumNetworkConfiguration,
  StaticEthereumNetworkSettings,
} from '@models/ethereum-models';
import { HasChildren } from '@models/has-children';
import { RootState } from '@store/index';
import { EthereumNetworkID } from 'dlc-btc-lib/models';
import { Contract } from 'ethers';

interface EthereumNetworkConfigurationContext extends EthereumNetworkConfiguration {
  getReadOnlyDLCManagerContract: (rpcEndpoint?: string) => Contract;
  getReadOnlyDLCBTCContract: (rpcEndpoint?: string) => Contract;
  getDLCManagerContract: (rpcEndpoint?: string) => Promise<Contract>;
}

const staticEthereumNetworkSettingsMap: Record<EthereumNetworkID, StaticEthereumNetworkSettings> = {
  [EthereumNetworkID.ArbitrumSepolia]: {
    ethereumExplorerAPIURL: 'https://sepolia.arbiscan.io',
    ethereumAttestorChainID: 'evm-arbsepolia',
  },
  [EthereumNetworkID.Arbitrum]: {
    ethereumExplorerAPIURL: 'https://arbiscan.io',
    ethereumAttestorChainID: 'evm-arbitrum',
  },
  [EthereumNetworkID.Hardhat]: {
    ethereumExplorerAPIURL: 'https://arbiscan.io',
    ethereumAttestorChainID: 'evm-localhost',
  },
};

const defaultEthereumNetwork = appConfiguration.enabledEthereumNetworkIDs.at(0)!;

const defaultEthereumNetworkConfiguration = {
  ethereumExplorerAPIURL:
    staticEthereumNetworkSettingsMap[defaultEthereumNetwork].ethereumExplorerAPIURL,
  ethereumAttestorChainID:
    staticEthereumNetworkSettingsMap[defaultEthereumNetwork].ethereumAttestorChainID,
  enabledEthereumNetworks: appConfiguration.enabledEthereumNetworkIDs.map(id =>
    getEthereumNetworkByID(id)
  ),
  ethereumContractDeploymentPlans: getEthereumNetworkDeploymentPlans(
    getEthereumNetworkByID(defaultEthereumNetwork)
  ),
};

export const EthereumNetworkConfigurationContext =
  createContext<EthereumNetworkConfigurationContext>({
    ...defaultEthereumNetworkConfiguration,
    getDLCManagerContract: () => {
      throw new Error('Not implemented');
    },
    getReadOnlyDLCManagerContract: () => {
      throw new Error('Not implemented');
    },
    getReadOnlyDLCBTCContract: () => {
      throw new Error('Not implemented');
    },
  });

export function EthereumNetworkConfigurationContextProvider({
  children,
}: HasChildren): React.JSX.Element {
  const { walletType, network: ethereumNetwork } = useSelector((state: RootState) => state.account);

  const [ethereumNetworkConfiguration, setEthereumNetworkConfiguration] =
    useState<EthereumNetworkConfiguration>(defaultEthereumNetworkConfiguration);

  useQuery(
    `ethereumNetworkConfiguration-${ethereumNetwork}`,
    getAndSetEthereumNetworkConfiguration
  );

  function getAndSetEthereumNetworkConfiguration(): void {
    setEthereumNetworkConfiguration({
      ethereumExplorerAPIURL:
        staticEthereumNetworkSettingsMap[ethereumNetwork.id].ethereumExplorerAPIURL,
      ethereumAttestorChainID:
        staticEthereumNetworkSettingsMap[ethereumNetwork.id].ethereumAttestorChainID,
      enabledEthereumNetworks: appConfiguration.enabledEthereumNetworkIDs.map(id =>
        getEthereumNetworkByID(id)
      ),
      ethereumContractDeploymentPlans: getEthereumNetworkDeploymentPlans(ethereumNetwork),
    });
  }

  async function getDLCManagerContract(): Promise<Contract> {
    return getEthereumContractWithSigner(
      ethereumNetworkConfiguration.ethereumContractDeploymentPlans,
      'DLCManager',
      walletType,
      ethereumNetwork
    );
  }

  function getReadOnlyDLCManagerContract(rpcEndpoint?: string): Contract {
    return getEthereumContractWithProvider(
      ethereumNetworkConfiguration.ethereumContractDeploymentPlans,
      ethereumNetwork,
      'DLCManager',
      rpcEndpoint ?? ethereumNetwork.defaultNodeURL
    );
  }

  function getReadOnlyDLCBTCContract(rpcEndpoint?: string): Contract {
    return getEthereumContractWithProvider(
      ethereumNetworkConfiguration.ethereumContractDeploymentPlans,
      ethereumNetwork,
      'DLCBTC',
      rpcEndpoint ?? ethereumNetwork.defaultNodeURL
    );
  }

  return (
    <EthereumNetworkConfigurationContext.Provider
      value={{
        ethereumExplorerAPIURL: ethereumNetworkConfiguration.ethereumExplorerAPIURL,
        ethereumContractDeploymentPlans:
          ethereumNetworkConfiguration.ethereumContractDeploymentPlans,
        ethereumAttestorChainID: ethereumNetworkConfiguration.ethereumAttestorChainID,
        enabledEthereumNetworks: ethereumNetworkConfiguration.enabledEthereumNetworks,
        getReadOnlyDLCManagerContract,
        getReadOnlyDLCBTCContract,
        getDLCManagerContract,
      }}
    >
      {children}
    </EthereumNetworkConfigurationContext.Provider>
  );
}
