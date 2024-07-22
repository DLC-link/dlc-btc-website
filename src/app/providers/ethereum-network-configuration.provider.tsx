import React, { createContext, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { getEthereumNetworkDeploymentPlans } from '@functions/configuration.functions';
import {
  EthereumNetworkConfiguration,
  StaticEthereumNetworkSettings,
} from '@models/ethereum-models';
import { HasChildren } from '@models/has-children';
import { RootState } from '@store/index';
import { supportedEthereumNetworks } from 'dlc-btc-lib/constants';
import { EthereumNetwork, EthereumNetworkID } from 'dlc-btc-lib/models';

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

const defaultEthereumNetworkConfiguration = {
  ethereumExplorerAPIURL:
    staticEthereumNetworkSettingsMap[appConfiguration.enabledEthereumNetworkIDs[0]]
      .ethereumExplorerAPIURL,
  ethereumAttestorChainID:
    staticEthereumNetworkSettingsMap[appConfiguration.enabledEthereumNetworkIDs[0]]
      .ethereumAttestorChainID,
  enabledEthereumNetworks: appConfiguration.enabledEthereumNetworkIDs.map(id =>
    getEthereumNetworkByID(id as EthereumNetworkID)
  ),
  ethereumContractDeploymentPlans: getEthereumNetworkDeploymentPlans(
    getEthereumNetworkByID(EthereumNetworkID.ArbitrumSepolia)
  ),
};

function getEthereumNetworkByID(ethereumNetworkID: EthereumNetworkID): EthereumNetwork {
  const ethereumNetwork = supportedEthereumNetworks.find(
    network => network.id === ethereumNetworkID
  );
  if (!ethereumNetwork) {
    throw new Error(`Unsupported Ethereum network: ${ethereumNetworkID}`);
  }
  return ethereumNetwork;
}

export const EthereumNetworkConfigurationContext = createContext<EthereumNetworkConfiguration>(
  defaultEthereumNetworkConfiguration
);

export function EthereumNetworkConfigurationContextProvider({
  children,
}: HasChildren): React.JSX.Element {
  const { network: ethereumNetwork } = useSelector((state: RootState) => state.account);

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
        getEthereumNetworkByID(id as EthereumNetworkID)
      ),
      ethereumContractDeploymentPlans: getEthereumNetworkDeploymentPlans(ethereumNetwork),
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
      }}
    >
      {children}
    </EthereumNetworkConfigurationContext.Provider>
  );
}
