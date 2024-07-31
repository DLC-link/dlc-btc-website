import React, { createContext, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import {
  getEthereumContractWithProvider,
  getEthereumContractWithSigner,
  getEthereumNetworkByID,
  getEthereumNetworkDeploymentPlans,
} from '@functions/configuration.functions';
import { EthereumNetworkConfiguration } from '@models/ethereum-models';
import { HasChildren } from '@models/has-children';
import { WalletType } from '@models/wallet';
import { RootState } from '@store/index';
import { EthereumNetworkID } from 'dlc-btc-lib/models';
import { Contract } from 'ethers';

interface EthereumNetworkConfigurationContext extends EthereumNetworkConfiguration {
  getReadOnlyDLCManagerContract: (rpcEndpoint?: string) => Contract;
  getReadOnlyDLCBTCContract: (rpcEndpoint?: string) => Contract;
  getDLCManagerContract: (rpcEndpoint?: string) => Promise<Contract>;
}
const defaultEthereumNetwork = getEthereumNetworkByID(
  appConfiguration.enabledEthereumNetworkIDs.at(0)!
);

const commonEthereumNetworkConfigurationFields = {
  enabledEthereumNetworks: appConfiguration.enabledEthereumNetworkIDs.map(id =>
    getEthereumNetworkByID(id)
  ),
  ethereumContractDeploymentPlans: getEthereumNetworkDeploymentPlans(defaultEthereumNetwork),
};

const ethereumNetworkConfigurationMap: Record<EthereumNetworkID, EthereumNetworkConfiguration> = {
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
    getDLCManagerContract: () =>
      getEthereumContractWithSigner(
        defaultEthereumNetworkConfiguration.ethereumContractDeploymentPlans,
        'DLCManager',
        WalletType.Metamask,
        defaultEthereumNetwork
      ),
    getReadOnlyDLCManagerContract: (rpcEndpoint?: string) =>
      getEthereumContractWithProvider(
        defaultEthereumNetworkConfiguration.ethereumContractDeploymentPlans,
        defaultEthereumNetwork,
        'DLCManager',
        rpcEndpoint ?? defaultEthereumNetwork.defaultNodeURL
      ),
    getReadOnlyDLCBTCContract: (rpcEndpoint?: string) =>
      getEthereumContractWithProvider(
        defaultEthereumNetworkConfiguration.ethereumContractDeploymentPlans,
        defaultEthereumNetwork,
        'DLCBTC',
        rpcEndpoint ?? defaultEthereumNetwork.defaultNodeURL
      ),
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
        ethereumNetworkConfigurationMap[ethereumNetwork.id].ethereumExplorerAPIURL,
      ethereumAttestorChainID:
        ethereumNetworkConfigurationMap[ethereumNetwork.id].ethereumAttestorChainID,
      enabledEthereumNetworks:
        ethereumNetworkConfigurationMap[ethereumNetwork.id].enabledEthereumNetworks,
      ethereumContractDeploymentPlans:
        ethereumNetworkConfigurationMap[ethereumNetwork.id].ethereumContractDeploymentPlans,
    });
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
            ethereumNetwork,
            'DLCManager',
            rpcEndpoint ?? ethereumNetwork.defaultNodeURL
          ),
        getReadOnlyDLCBTCContract: (rpcEndpoint?: string) =>
          getEthereumContractWithProvider(
            ethereumNetworkConfiguration.ethereumContractDeploymentPlans,
            ethereumNetwork,
            'DLCBTC',
            rpcEndpoint ?? ethereumNetwork.defaultNodeURL
          ),
        getDLCManagerContract: async () =>
          getEthereumContractWithSigner(
            ethereumNetworkConfiguration.ethereumContractDeploymentPlans,
            'DLCManager',
            walletType,
            ethereumNetwork
          ),
      }}
    >
      {children}
    </EthereumNetworkConfigurationContext.Provider>
  );
}
