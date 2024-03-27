import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { BitcoinNetwork, bitcoin, regtest, testnet } from '@models/bitcoin-network';
import { EthereumNetworkID } from '@models/ethereum-network';
import { RootState } from '@store/index';

interface NetworkEndpoints {
  attestorAPIURLs: string[];
  ethereumExplorerAPIURL: string;
  ethereumAttestorChainID: string;
  bitcoinExplorerAPIURL: string;
  bitcoinBlockchainAPIURL: string;
  mempoolSpaceAPIFeeURL: string;
  bitcoinNetwork: BitcoinNetwork;
  bitcoinNetworkName: string;
}

export function useEndpoints(): NetworkEndpoints {
  const { network } = useSelector((state: RootState) => state.account);

  const [attestorAPIURLs, setAttestorAPIURLs] = useState<string[]>([]);
  const [ethereumExplorerAPIURL, setEthereumExplorerAPIURL] = useState<string>('');
  const [ethereumAttestorChainID, setEthereumAttestorChainID] = useState<string>('');
  const [bitcoinExplorerAPIURL, setBitcoinExplorerAPIURL] = useState<string>('');
  const [bitcoinBlockchainAPIURL, setBitcoinBlockchainAPIURL] = useState<string>('');
  const [mempoolSpaceAPIFeeURL, setMempoolSpaceAPIFeeURL] = useState<string>('');

  const [bitcoinNetwork, setBitcoinNetwork] = useState<BitcoinNetwork>(regtest);
  const [bitcoinNetworkName, setBitcoinNetworkName] = useState<string>('');

  useEffect(() => {
    if (!network) return;

    const {
      attestorAPIURLs,
      ethereumExplorerAPIURL,
      ethereumAttestorChainID,
      bitcoinExplorerAPIURL,
      bitcoinBlockchainAPIURL,
      mempoolSpaceAPIFeeURL,
      bitcoinNetwork,
      bitcoinNetworkName,
    } = getEndpoints();

    setAttestorAPIURLs(attestorAPIURLs);
    setEthereumExplorerAPIURL(ethereumExplorerAPIURL);
    setEthereumAttestorChainID(ethereumAttestorChainID);
    setBitcoinExplorerAPIURL(bitcoinExplorerAPIURL);
    setBitcoinBlockchainAPIURL(bitcoinBlockchainAPIURL);
    setMempoolSpaceAPIFeeURL(mempoolSpaceAPIFeeURL);
    setBitcoinNetwork(bitcoinNetwork);
    setBitcoinNetworkName(bitcoinNetworkName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);

  function getEndpoints(): NetworkEndpoints {
    const attestorAPIURLs: string[] = import.meta.env.VITE_ATTESTOR_API_URLS.split(',');

    const bitcoinNetworkName = import.meta.env.VITE_BITCOIN_NETWORK;
    const bitcoinBlockchainAPIURL = import.meta.env.VITE_BITCOIN_BLOCKCHAIN_API_URL;
    const bitcoinExplorerAPIURL = import.meta.env.VITE_BITCOIN_EXPLORER_API_URL;

    let bitcoinNetwork: BitcoinNetwork;
    let mempoolSpaceAPIFeeURL: string;

    switch (bitcoinNetworkName) {
      case 'mainnet':
        bitcoinNetwork = bitcoin;
        mempoolSpaceAPIFeeURL = 'https://mempool.space/api/v1/fees/recommended';
        break;
      case 'testnet':
        bitcoinNetwork = testnet;
        mempoolSpaceAPIFeeURL = 'https://mempool.space/testnet/api/v1/fees/recommended';
        break;
      default:
        bitcoinNetwork = regtest;
        mempoolSpaceAPIFeeURL = 'https://mempool.space/testnet/api/v1/fees/recommended';
    }

    switch (network?.id) {
      case EthereumNetworkID.Sepolia:
        return {
          attestorAPIURLs,
          ethereumExplorerAPIURL: 'https://sepolia.etherscan.io/tx/',
          ethereumAttestorChainID: 'evm-sepolia',
          bitcoinExplorerAPIURL,
          bitcoinBlockchainAPIURL,
          mempoolSpaceAPIFeeURL,
          bitcoinNetwork,
          bitcoinNetworkName,
        };
      case EthereumNetworkID.Goerli:
        return {
          attestorAPIURLs,
          ethereumExplorerAPIURL: 'https://goerli.etherscan.io/tx/',
          ethereumAttestorChainID: 'evm-goerli',
          bitcoinExplorerAPIURL,
          bitcoinBlockchainAPIURL,
          mempoolSpaceAPIFeeURL,
          bitcoinNetwork,
          bitcoinNetworkName,
        };
      case EthereumNetworkID.X1Testnet:
        return {
          attestorAPIURLs,
          ethereumExplorerAPIURL: 'https://www.oklink.com/x1-test/tx/',
          ethereumAttestorChainID: 'evm-x1-test',
          bitcoinExplorerAPIURL,
          bitcoinBlockchainAPIURL,
          mempoolSpaceAPIFeeURL,
          bitcoinNetwork,
          bitcoinNetworkName,
        };
      default:
        throw new Error(`Unsupported network: ${network?.name}`);
    }
  }
  return {
    attestorAPIURLs,
    ethereumExplorerAPIURL,
    ethereumAttestorChainID,
    bitcoinExplorerAPIURL,
    bitcoinBlockchainAPIURL,
    mempoolSpaceAPIFeeURL,
    bitcoinNetwork,
    bitcoinNetworkName,
  };
}
