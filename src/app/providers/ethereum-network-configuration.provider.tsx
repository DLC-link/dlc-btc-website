import React, { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  getEthereumContractWithProvider,
  getEthereumNetworkByID,
  getEthereumNetworkDeploymentPlans,
} from '@functions/configuration.functions';
import { EthereumNetworkConfiguration } from '@models/ethereum-models';
import { HasChildren } from '@models/has-children';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { EthereumNetworkID } from 'dlc-btc-lib/models';
import { equals, find } from 'ramda';
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  hardhat,
  mainnet,
  sepolia,
} from 'viem/chains';
import { useAccount } from 'wagmi';

import { SUPPORTED_VIEM_CHAINS } from '@shared/constants/ethereum.constants';

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

const enabledEthereumNetworks = appConfiguration.enabledEthereumNetworkIDs.map(id =>
  getEthereumNetworkByID(id)
);

function getEthereumNetworkConfiguration(
  ethereumNetworkID: EthereumNetworkID
): EthereumNetworkConfiguration {
  switch (ethereumNetworkID) {
    case EthereumNetworkID.Mainnet:
      return {
        ethereumExplorerAPIURL: mainnet.blockExplorers.default.apiUrl,
        websocketURL: appConfiguration.l1Websocket,
        httpURL: appConfiguration.l1HTTP,
        ethereumAttestorChainID: 'evm-mainnet',
        enabledEthereumNetworks,
        dlcManagerContract: getEthereumContractWithProvider(
          getEthereumNetworkDeploymentPlans(mainnet),
          mainnet,
          'DLCManager',
          appConfiguration.l1Websocket
        ),
        dlcBTCContract: getEthereumContractWithProvider(
          getEthereumNetworkDeploymentPlans(mainnet),
          mainnet,
          'DLCBTC',
          appConfiguration.l1Websocket
        ),
        chain: mainnet,
      };
    case EthereumNetworkID.Sepolia:
      return {
        ethereumExplorerAPIURL: sepolia.blockExplorers.default.apiUrl,
        websocketURL: appConfiguration.l1Websocket,
        httpURL: appConfiguration.l1HTTP,
        ethereumAttestorChainID: 'evm-sepolia',
        enabledEthereumNetworks,
        dlcManagerContract: getEthereumContractWithProvider(
          getEthereumNetworkDeploymentPlans(sepolia),
          sepolia,
          'DLCManager',
          appConfiguration.l1Websocket
        ),
        dlcBTCContract: getEthereumContractWithProvider(
          getEthereumNetworkDeploymentPlans(sepolia),
          sepolia,
          'DLCBTC',
          appConfiguration.l1Websocket
        ),
        chain: sepolia,
      };
    case EthereumNetworkID.Base:
      return {
        ethereumExplorerAPIURL: base.blockExplorers.default.apiUrl,
        websocketURL: appConfiguration.baseWebsocket,
        httpURL: appConfiguration.baseHTTP,
        ethereumAttestorChainID: 'evm-base',
        enabledEthereumNetworks,
        dlcManagerContract: getEthereumContractWithProvider(
          getEthereumNetworkDeploymentPlans(base),
          base,
          'DLCManager',
          appConfiguration.baseWebsocket
        ),
        dlcBTCContract: getEthereumContractWithProvider(
          getEthereumNetworkDeploymentPlans(base),
          base,
          'DLCBTC',
          appConfiguration.baseWebsocket
        ),
        chain: base,
      };
    case EthereumNetworkID.BaseSepolia:
      return {
        ethereumExplorerAPIURL: baseSepolia.blockExplorers.default.apiUrl,
        websocketURL: appConfiguration.baseWebsocket,
        httpURL: appConfiguration.baseHTTP,
        ethereumAttestorChainID: 'evm-basesepolia',
        enabledEthereumNetworks,
        dlcManagerContract: getEthereumContractWithProvider(
          getEthereumNetworkDeploymentPlans(baseSepolia),
          baseSepolia,
          'DLCManager',
          baseSepolia.rpcUrls.default.http[0]
        ),
        dlcBTCContract: getEthereumContractWithProvider(
          getEthereumNetworkDeploymentPlans(baseSepolia),
          baseSepolia,
          'DLCBTC',
          baseSepolia.rpcUrls.default.http[0]
        ),
        chain: baseSepolia,
      };
    case EthereumNetworkID.Arbitrum:
      return {
        ethereumExplorerAPIURL: arbitrum.blockExplorers.default.apiUrl,
        websocketURL: appConfiguration.arbitrumWebsocket,
        httpURL: appConfiguration.arbitrumHTTP,
        ethereumAttestorChainID: 'evm-arbitrum',
        enabledEthereumNetworks,
        dlcManagerContract: getEthereumContractWithProvider(
          getEthereumNetworkDeploymentPlans(arbitrum),
          arbitrum,
          'DLCManager',
          appConfiguration.arbitrumWebsocket
        ),
        dlcBTCContract: getEthereumContractWithProvider(
          getEthereumNetworkDeploymentPlans(arbitrum),
          arbitrum,
          'DLCBTC',
          appConfiguration.arbitrumWebsocket
        ),
        chain: arbitrum,
      };
    case EthereumNetworkID.ArbitrumSepolia:
      return {
        ethereumExplorerAPIURL: arbitrumSepolia.blockExplorers.default.apiUrl,
        websocketURL: appConfiguration.arbitrumWebsocket,
        httpURL: appConfiguration.arbitrumHTTP,
        ethereumAttestorChainID: 'evm-arbsepolia',
        enabledEthereumNetworks,
        dlcManagerContract: getEthereumContractWithProvider(
          getEthereumNetworkDeploymentPlans(arbitrumSepolia),
          arbitrumSepolia,
          'DLCManager',
          appConfiguration.arbitrumWebsocket
        ),
        dlcBTCContract: getEthereumContractWithProvider(
          getEthereumNetworkDeploymentPlans(arbitrumSepolia),
          arbitrumSepolia,
          'DLCBTC',
          appConfiguration.arbitrumWebsocket
        ),
        chain: arbitrumSepolia,
      };
    case EthereumNetworkID.Hardhat:
      return {
        ethereumExplorerAPIURL: '',
        websocketURL: hardhat.rpcUrls.default.http[0],
        httpURL: hardhat.rpcUrls.default.http[0],
        ethereumAttestorChainID: 'evm-hardhat-arb',
        enabledEthereumNetworks,
        dlcManagerContract: getEthereumContractWithProvider(
          getEthereumNetworkDeploymentPlans(hardhat),
          hardhat,
          'DLCManager'
        ),
        dlcBTCContract: getEthereumContractWithProvider(
          getEthereumNetworkDeploymentPlans(hardhat),
          hardhat,
          'DLCBTC'
        ),
        chain: hardhat,
      };
    default:
      throw new Error(`Unsupported Ethereum network ID: ${ethereumNetworkID}`);
  }
}

const defaultEthereumNetworkConfiguration = getEthereumNetworkConfiguration(
  defaultEthereumNetwork.id.toString() as EthereumNetworkID
);

interface EthereumNetworkConfigurationContext {
  ethereumNetworkConfiguration: EthereumNetworkConfiguration;
  isEthereumNetworkConfigurationLoading: boolean;
}
export const EthereumNetworkConfigurationContext =
  createContext<EthereumNetworkConfigurationContext>({
    ethereumNetworkConfiguration: defaultEthereumNetworkConfiguration,
    isEthereumNetworkConfigurationLoading: false,
  });

export function EthereumNetworkConfigurationContextProvider({
  children,
}: HasChildren): React.JSX.Element {
  const dispatch = useDispatch();
  const { chain, isConnected } = useAccount();
  const [ethereumNetworkConfiguration, setEthereumNetworkConfiguration] =
    useState<EthereumNetworkConfiguration>(
      chain
        ? getEthereumNetworkConfiguration(chain?.id.toString() as EthereumNetworkID)
        : defaultEthereumNetworkConfiguration
    );
  const [isEthereumNetworkConfigurationLoading, setIsEthereumNetworkConfigurationLoading] =
    useState(false);

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    if (isConnected && !chain) {
      dispatch(mintUnmintActions.resetMintUnmintState());
      //ilyenkor kell megmutatni a bannert
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain]);

  useEffect(() => {
    setIsEthereumNetworkConfigurationLoading(true);

    if (!chain) {
      setEthereumNetworkConfiguration(defaultEthereumNetworkConfiguration);
      return;
    }

    const currentEthereumNetworkConfiguration = getEthereumNetworkConfiguration(
      chain?.id.toString() as EthereumNetworkID
    );

    setEthereumNetworkConfiguration(currentEthereumNetworkConfiguration);
    setIsEthereumNetworkConfigurationLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain]);

  return (
    <EthereumNetworkConfigurationContext.Provider
      value={{ ethereumNetworkConfiguration, isEthereumNetworkConfigurationLoading }}
    >
      {children}
    </EthereumNetworkConfigurationContext.Provider>
  );
}
