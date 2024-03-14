/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';

import { EthereumError } from '@models/error-types';
import {
  EthereumNetwork,
  Network,
  addNetworkParams,
  ethereumNetworks,
  hexChainIDs,
} from '@models/network';
import { WalletType } from '@models/wallet';
import { EthereumContext } from '@providers/blockchain-context-provider';
import { RootState, store } from '@store/index';
import { accountActions } from '@store/slices/account/account.actions';
import { ethers } from 'ethers';
import { Logger } from 'ethers/lib/utils';

export interface UseEthereumReturnType {
  connectEthereumAccount: (network: Network, walletType: WalletType) => Promise<void>;
  isLoaded: boolean;
}

function throwEthereumError(message: string, error: any): void {
  if (error.code === Logger.errors.CALL_EXCEPTION) {
    throw new EthereumError(
      `${message}${error instanceof Error && 'errorName' in error ? error.errorName : error}`
    );
  } else {
    throw new EthereumError(`${message}${error.code}`);
  }
}

export function useEthereumAccount(): UseEthereumReturnType {
  // const { network, walletType } = useSelector((state: RootState) => state.account);
  const { setEthereumSigner } = useContext(EthereumContext);
  const network = ethereumNetworks[2];
  const walletType = WalletType.Metamask;

  const [walletProvider, setWalletProvider] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  function validateMetaMask(provider: any): boolean {
    return (
      typeof provider === 'object' &&
      provider !== null &&
      '_metamask' in provider &&
      'isMetaMask' in provider &&
      provider.isMetaMask === true
    );
  }

  function checkIfMultipleEthereumProviders(ethereum: any): boolean {
    return (
      'providerMap' in ethereum &&
      ethereum.providerMap instanceof Map &&
      ethereum.providerMap.size > 1
    );
  }

  function alertMissingWallet(walletType: WalletType): void {
    alert(`Install ${walletType}!`);
    throw new EthereumError(`${walletType} wallet not found`);
  }

  function alertNonMetaMaskProvider(): void {
    alert(
      'Your current Ethereum provider is not MetaMask. Please ensure that MetaMask is your active Ethereum wallet and disable any other Ethereum wallets in your browser, then reload the page.'
    );
  }

  function getWalletProvider(): any {
    if (!walletType) throw new Error('Please select a wallet to connect to Ethereum.');

    const { ethereum } = window;

    if (!ethereum) {
      alertMissingWallet(walletType);
    }

    let provider;

    if (checkIfMultipleEthereumProviders(ethereum)) {
      switch (walletType) {
        case WalletType.Metamask:
          provider = ethereum.providerMap.get(walletType);
          if (validateMetaMask(provider)) {
            provider = ethereum.providerMap.get(walletType);
            break;
          } else {
            alertNonMetaMaskProvider();
            break;
          }
        default:
          alertMissingWallet(walletType);
          break;
      }
    } else {
      switch (walletType) {
        case WalletType.Metamask:
          if (validateMetaMask(ethereum)) {
            provider = ethereum;
            break;
          } else {
            alertNonMetaMaskProvider();
            break;
          }
        default:
          alertMissingWallet(walletType);
          break;
      }
    }

    return provider;
  }

  async function addEthereumNetwork(ethereumNetwork: EthereumNetwork): Promise<void> {
    if (!walletProvider) {
      throw new EthereumError('Wallet Provider is not set, please connect to an Ethereum Wallet.');
    }

    try {
      await walletProvider.request({
        method: 'wallet_addEthereumChain',
        params: addNetworkParams[ethereumNetwork],
      });
    } catch (error: any) {
      throwEthereumError(`Could not add Ethereum network: `, error);
    }
  }

  async function switchEthereumNetwork(ethereumNetwork: EthereumNetwork): Promise<void> {
    if (!walletProvider) {
      throw new EthereumError('Wallet Provider is not set, please connect to an Ethereum Wallet.');
    }

    try {
      await walletProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainIDs[ethereumNetwork] }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await addEthereumNetwork(ethereumNetwork);
      } else {
        throwEthereumError(`Could not switch Ethereum network: `, error);
      }
    }
  }

  async function getEthereumSigner(walletProvider: any) {
    if (!walletType) throw new Error('Please select a wallet to connect to Ethereum.');
    if (!network) throw new Error('Please select a network to connect to Ethereum.');

    try {
      const browserProvider = new ethers.providers.Web3Provider(walletProvider, 'any');

      const signer = browserProvider.getSigner();
      const walletNetwork = await browserProvider.getNetwork();
      const walletNetworkChainID = walletNetwork.chainId.toString();

      if (walletNetworkChainID !== network.id) {
        await switchEthereumNetwork(network.id);
        window.location.reload();
      }
      console.log('setEthereumSigner:', setEthereumSigner);
      setEthereumSigner(signer);
    } catch (error) {
      throw new Error(`Could not get Ethereum signer: ${error}`);
    }
  }

  async function connectEthereumAccount() {
    try {
      console.log('Connecting to Ethereum...');
      console.log('Wallet type:', walletType);

      if (!walletType) throw new Error('Please select a wallet to connect to Ethereum.');
      if (!network) throw new Error('Please select a network to connect to Ethereum.');
      console.log('Network:', network);

      setIsLoaded(false);

      const walletProvider = getWalletProvider();
      console.log('Wallet Provider:', walletProvider);
      setWalletProvider(walletProvider);

      const ethereumAccounts = await walletProvider.request({
        method: 'eth_requestAccounts',
      });

      const ethereumSigner = await getEthereumSigner(walletProvider);
      setEthereumSigner(ethereumSigner);

      const accountInformation = {
        walletType: WalletType.Metamask,
        address: ethereumAccounts[0],
        network,
      };

      store.dispatch(accountActions.login(accountInformation));

      setIsLoaded(true);
    } catch (error) {
      throw Error(`Could not connect to Ethereum: ${error}`);
    }
  }

  return {
    connectEthereumAccount,
    isLoaded,
  };
}
