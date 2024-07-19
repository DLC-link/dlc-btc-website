import { WalletType } from '@models/wallet';
import { addNetworkParams, hexChainIDs } from 'dlc-btc-lib/constants';
import { EthereumNetwork, EthereumNetworkID } from 'dlc-btc-lib/models';
import { ethers } from 'ethers';

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

export function getWalletProvider(walletType: WalletType): any {
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

export async function connectEthereumAccount(
  walletType: WalletType,
  ethereumNetwork: EthereumNetwork
): Promise<{ ethereumUserAddress: string; ethereumSigner: ethers.providers.JsonRpcSigner }> {
  try {
    const walletProvider = getWalletProvider(walletType);

    const ethereumAccounts = await walletProvider.request({
      method: 'eth_requestAccounts',
    });

    const ethereumSigner = await getEthereumSigner(walletProvider, ethereumNetwork);

    return {
      ethereumUserAddress: ethereumAccounts[0],
      ethereumSigner,
    };
  } catch (error) {
    throw Error(`Could not connect to Ethereum: ${error}`);
  }
}
