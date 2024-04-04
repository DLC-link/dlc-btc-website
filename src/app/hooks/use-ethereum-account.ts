/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  EthereumNetwork,
  EthereumNetworkID,
  addNetworkParams,
  hexChainIDs,
} from '@models/ethereum-network';
import { WalletType } from '@models/wallet';
import { RootState, store } from '@store/index';
import { accountActions } from '@store/slices/account/account.actions';
import { ethers } from 'ethers';

import { throwEthereumError } from './use-ethereum';
import { useEthereumContext } from './use-ethereum-context';

interface UseEthereumAccountReturnType {
  connectEthereumAccount: (walletType: WalletType, network: EthereumNetwork) => Promise<void>;
  recommendTokenToMetamask: () => Promise<boolean>;
  isLoaded: boolean;
}

function alertMissingWallet(walletType: WalletType): void {
  alert(`Install ${walletType}!`);
  throw new Error(`${walletType} wallet not found`);
}

function alertNonMetaMaskProvider(): void {
  alert(
    'Your current Ethereum provider is not MetaMask. Please ensure that MetaMask is your active Ethereum wallet and disable any other Ethereum wallets in your browser, then reload the page.'
  );
  throw new Error('Non-MetaMask Ethereum provider');
}

function alertNetworkNotSupported(ethereumNetworkID: string): void {
  alert(
    'Your current Ethereum network is not supported. Please switch to the correct Ethereum network, then reload the page.'
  );
  throw new Error(`Unsupported Ethereum network, ID: ${ethereumNetworkID}`);
}

export function useEthereumAccount(): UseEthereumAccountReturnType {
  const { dlcBTCContract, getEthereumContracts } = useEthereumContext();

  const { address, walletType, network } = useSelector((state: RootState) => state.account);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const connectAccountIfReady = async () => {
    if (address && walletType && network) {
      await connectEthereumAccount(walletType, network);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    connectAccountIfReady();
  }, [address, walletType, network]);

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

  function getWalletProvider(walletType: WalletType): any {
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

  async function addEthereumNetwork(
    walletProvider: any,
    ethereumNetwork: EthereumNetworkID
  ): Promise<void> {
    try {
      await walletProvider.request({
        method: 'wallet_addEthereumChain',
        params: addNetworkParams[ethereumNetwork],
      });
    } catch (error: any) {
      throw new Error(`Could not add Ethereum network: ${error}`);
    }
  }

  async function switchEthereumNetwork(
    walletProvider: any,
    ethereumNetwork: EthereumNetworkID
  ): Promise<void> {
    try {
      await walletProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainIDs[ethereumNetwork] }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await addEthereumNetwork(walletProvider, ethereumNetwork);
      } else {
        throw new Error(`Could not switch Ethereum network: ${error}`);
      }
    }
  }

  async function getEthereumSigner(walletProvider: any, network: EthereumNetwork) {
    try {
      const browserProvider = new ethers.providers.Web3Provider(walletProvider, 'any');

      const signer = browserProvider.getSigner();
      const walletNetwork = await browserProvider.getNetwork();
      const walletNetworkID = walletNetwork.chainId.toString();

      if (!Object.values(EthereumNetworkID).includes(walletNetworkID as EthereumNetworkID)) {
        alertNetworkNotSupported(walletNetworkID);
      }

      if (walletNetworkID !== network.id) {
        await switchEthereumNetwork(walletProvider, network.id);
        window.location.reload();
      }
      return signer;
    } catch (error) {
      throw new Error(`Could not get Ethereum signer: ${error}`);
    }
  }

  async function connectEthereumAccount(walletType: WalletType, ethereumNetwork: EthereumNetwork) {
    try {
      setIsLoaded(false);

      const walletProvider = getWalletProvider(walletType);

      const ethereumAccounts = await walletProvider.request({
        method: 'eth_requestAccounts',
      });

      const ethereumSigner = await getEthereumSigner(walletProvider, ethereumNetwork);

      await getEthereumContracts(ethereumSigner, ethereumNetwork);

      const accountInformation = {
        address: ethereumAccounts[0],
        walletType,
        network: ethereumNetwork,
      };

      store.dispatch(accountActions.login(accountInformation));

      setIsLoaded(true);
    } catch (error) {
      throw Error(`Could not connect to Ethereum: ${error}`);
    }
  }

  async function recommendTokenToMetamask(): Promise<boolean> {
    try {
      if (!walletType) throw new Error('Wallet not initialized');
      const walletProvider = getWalletProvider(walletType);

      const response = await walletProvider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: dlcBTCContract?.address,
            symbol: 'dlcBTC',
            decimals: 8,
            image: 'https://dlc-public-assets.s3.amazonaws.com/dlcBTC_Token.png',
          },
        },
      });
      await response.wait();
      return response;
    } catch (error) {
      throwEthereumError(`Could not recommend dlcBTC token to MetaMask: `, error);
      return false;
    }
  }

  return {
    connectEthereumAccount,
    recommendTokenToMetamask,
    isLoaded,
  };
}
