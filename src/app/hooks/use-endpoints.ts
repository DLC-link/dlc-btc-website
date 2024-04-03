import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { BitcoinNetwork, bitcoin, regtest, testnet } from '@models/bitcoin-network';
import { EthereumNetwork, EthereumNetworkID, ethereumNetworks } from '@models/ethereum-network';
import { RootState } from '@store/index';

interface NetworkEndpoints {
  attestorAPIURLs: string[];
  ethereumExplorerAPIURL: string;
  ethereumAttestorChainID: string;
  enabledEthereumNetworks: EthereumNetwork[];
  bitcoinExplorerAPIURL: string;
  bitcoinBlockchainAPIURL: string;
  mempoolSpaceAPIFeeURL: string;
  bitcoinNetwork: BitcoinNetwork;
  bitcoinNetworkName: string;
}

function getEthereumNetworkByID(ethereumNetworkID: EthereumNetworkID): EthereumNetwork {
  const ethereumNetwork = ethereumNetworks.find(network => network.id === ethereumNetworkID);
  if (!ethereumNetwork) {
    throw new Error(`Unsupported Ethereum network: ${ethereumNetworkID}`);
  }
  return ethereumNetwork;
}

export function useEndpoints(): NetworkEndpoints {
  const { network } = useSelector((state: RootState) => state.account);

  const [attestorAPIURLs, setAttestorAPIURLs] = useState<string[]>([]);
  const [ethereumExplorerAPIURL, setEthereumExplorerAPIURL] = useState<string>('');
  const [ethereumAttestorChainID, setEthereumAttestorChainID] = useState<string>('');
  const [bitcoinExplorerAPIURL, setBitcoinExplorerAPIURL] = useState<string>('');
  const [bitcoinBlockchainAPIURL, setBitcoinBlockchainAPIURL] = useState<string>('');
  const [mempoolSpaceAPIFeeURL, setMempoolSpaceAPIFeeURL] = useState<string>('');
  const [enabledEthereumNetworks, setEnabledEthereumNetworks] = useState<EthereumNetwork[]>([]);

  const [bitcoinNetwork, setBitcoinNetwork] = useState<BitcoinNetwork>(regtest);
  const [bitcoinNetworkName, setBitcoinNetworkName] = useState<string>('');

  useEffect(() => {
    if (!network) return;

    const {
      attestorAPIURLs,
      ethereumExplorerAPIURL,
      ethereumAttestorChainID,
      enabledEthereumNetworks,
      bitcoinExplorerAPIURL,
      bitcoinBlockchainAPIURL,
      mempoolSpaceAPIFeeURL,
      bitcoinNetwork,
      bitcoinNetworkName,
    } = getEndpoints();

    setAttestorAPIURLs(attestorAPIURLs);
    setEthereumExplorerAPIURL(ethereumExplorerAPIURL);
    setEthereumAttestorChainID(ethereumAttestorChainID);
    setEnabledEthereumNetworks(enabledEthereumNetworks);
    setBitcoinExplorerAPIURL(bitcoinExplorerAPIURL);
    setBitcoinBlockchainAPIURL(bitcoinBlockchainAPIURL);
    setMempoolSpaceAPIFeeURL(mempoolSpaceAPIFeeURL);
    setBitcoinNetwork(bitcoinNetwork);
    setBitcoinNetworkName(bitcoinNetworkName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);

  function getEndpoints(): NetworkEndpoints {
    const attestorAPIURLs: string[] = import.meta.env.VITE_ATTESTOR_API_URLS.split(',');
    const enableEthereumNetworkIDs: string[] = import.meta.env.VITE_ENABLED_ETHEREUM_NETWORKS.split(
      ','
    );
    const enabledEthereumNetworks: EthereumNetwork[] = enableEthereumNetworkIDs.map(id =>
      getEthereumNetworkByID(id as EthereumNetworkID)
    );

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
          enabledEthereumNetworks,
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
          enabledEthereumNetworks,
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
          enabledEthereumNetworks,
          bitcoinExplorerAPIURL,
          bitcoinBlockchainAPIURL,
          mempoolSpaceAPIFeeURL,
          bitcoinNetwork,
          bitcoinNetworkName,
        };
      case EthereumNetworkID.ArbSepolia:
        return {
          attestorAPIURLs,
          ethereumExplorerAPIURL: 'https://sepolia.arbiscan.io/tx/',
          ethereumAttestorChainID: 'evm-arbsepolia',
          enabledEthereumNetworks,
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
    enabledEthereumNetworks,
    bitcoinExplorerAPIURL,
    bitcoinBlockchainAPIURL,
    mempoolSpaceAPIFeeURL,
    bitcoinNetwork,
    bitcoinNetworkName,
  };
}
