import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { BitcoinNetwork, bitcoin, regtest, testnet } from '@models/bitcoin-network';
import { EthereumNetwork } from '@models/network';
import { RootState } from '@store/index';

interface NetworkEndpoints {
  attestorAPIURLs: string[];
  ethereumExplorerAPIURL: string;
  bitcoinExplorerAPIURL: string;
  bitcoinBlockchainAPIURL: string;
  bitcoinNetwork: BitcoinNetwork;
}

export function useEndpoints(): NetworkEndpoints {
  const { network } = useSelector((state: RootState) => state.account);

  const [attestorAPIURLs, setAttestorAPIURLs] = useState<string[]>([]);
  const [ethereumExplorerAPIURL, setEthereumExplorerAPIURL] = useState<string>('');
  const [bitcoinExplorerAPIURL, setBitcoinExplorerAPIURL] = useState<string>('');
  const [bitcoinBlockchainAPIURL, setBitcoinBlockchainAPIURL] = useState<string>('');
  const [bitcoinNetwork, setBitcoinNetwork] = useState<BitcoinNetwork>(regtest);

  useEffect(() => {
    if (!network) return;

    const {
      attestorAPIURLs,
      ethereumExplorerAPIURL,
      bitcoinExplorerAPIURL,
      bitcoinBlockchainAPIURL,
    } = getEndpoints();

    setAttestorAPIURLs(attestorAPIURLs);
    setEthereumExplorerAPIURL(ethereumExplorerAPIURL);
    setBitcoinExplorerAPIURL(bitcoinExplorerAPIURL);
    setBitcoinBlockchainAPIURL(bitcoinBlockchainAPIURL);
    setBitcoinNetwork(bitcoinNetwork);
  }, [network]);

  function getEndpoints(): NetworkEndpoints {
    const attestorAPIURLs: string[] = import.meta.env.VITE_ATTESTOR_API_URLS.split(',');

    const bitcoinNetworkName = import.meta.env.VITE_BITCOIN_NETWORK;
    const bitcoinBlockchainAPIURL = import.meta.env.VITE_BITCOIN_BLOCKCHAIN_API_URL;
    const bitcoinExplorerAPIURL = import.meta.env.VITE_BITCOIN_EXPLORER_API_URL;
    let bitcoinNetwork;

    switch (bitcoinNetworkName) {
      case 'mainnet':
        bitcoinNetwork = bitcoin;
        break;
      case 'testnet':
        bitcoinNetwork = testnet;
        break;
      default:
        bitcoinNetwork = regtest;
    }

    switch (network?.id) {
      case EthereumNetwork.Sepolia:
        return {
          attestorAPIURLs,
          ethereumExplorerAPIURL: 'https://sepolia.etherscan.io/tx/',
          bitcoinExplorerAPIURL,
          bitcoinBlockchainAPIURL,
          bitcoinNetwork,
        };
      case EthereumNetwork.Goerli:
        return {
          attestorAPIURLs,
          ethereumExplorerAPIURL: 'https://goerli.etherscan.io/tx/',
          bitcoinExplorerAPIURL,
          bitcoinBlockchainAPIURL,
          bitcoinNetwork,
        };
      case EthereumNetwork.X1Testnet:
        return {
          attestorAPIURLs,
          ethereumExplorerAPIURL: 'https://www.oklink.com/x1-test/tx/',
          bitcoinExplorerAPIURL,
          bitcoinBlockchainAPIURL,
          bitcoinNetwork,
        };
      default:
        throw new Error(`Unsupported network: ${network?.name}`);
    }
  }
  return {
    attestorAPIURLs,
    ethereumExplorerAPIURL,
    bitcoinExplorerAPIURL,
    bitcoinBlockchainAPIURL,
    bitcoinNetwork,
  };
}
