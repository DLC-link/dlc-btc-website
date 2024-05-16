import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { EthereumNetwork, EthereumNetworkID, ethereumNetworks } from '@models/ethereum-network';
import { RootState } from '@store/index';
import { Network } from 'bitcoinjs-lib';
import { bitcoin, regtest, testnet } from 'bitcoinjs-lib/src/networks';

interface NetworkEndpoints {
  attestorAPIURLs: string[];
  ethereumExplorerAPIURL: string;
  ethereumAttestorChainID: string;
  enabledEthereumNetworks: EthereumNetwork[];
  bitcoinExplorerAPIURL: string;
  bitcoinBlockchainAPIURL: string;
  bitcoinBlockchainAPIFeeURL: string;
  bitcoinNetwork: Network;
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
  const [bitcoinBlockchainAPIFeeURL, setbitcoinBlockchainAPIFeeURL] = useState<string>('');
  const [enabledEthereumNetworks, setEnabledEthereumNetworks] = useState<EthereumNetwork[]>([]);

  const [bitcoinNetwork, setBitcoinNetwork] = useState<Network>(regtest);
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
      bitcoinBlockchainAPIFeeURL,
      bitcoinNetwork,
      bitcoinNetworkName,
    } = getEndpoints();

    setAttestorAPIURLs(attestorAPIURLs);
    setEthereumExplorerAPIURL(ethereumExplorerAPIURL);
    setEthereumAttestorChainID(ethereumAttestorChainID);
    setEnabledEthereumNetworks(enabledEthereumNetworks);
    setBitcoinExplorerAPIURL(bitcoinExplorerAPIURL);
    setBitcoinBlockchainAPIURL(bitcoinBlockchainAPIURL);
    setbitcoinBlockchainAPIFeeURL(bitcoinBlockchainAPIFeeURL);
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

    let bitcoinNetwork: Network;
    let bitcoinBlockchainAPIFeeURL: string;

    switch (bitcoinNetworkName) {
      case 'mainnet':
        bitcoinNetwork = bitcoin;
        bitcoinBlockchainAPIFeeURL = 'https://mempool.space/api/v1/fees/recommended';
        break;
      case 'testnet':
        bitcoinNetwork = testnet;
        bitcoinBlockchainAPIFeeURL = 'https://mempool.space/api/v1/fees/recommended';
        break;
      default:
        bitcoinNetwork = regtest;
        bitcoinBlockchainAPIFeeURL = 'https://devnet.dlc.link/electrs/fee-estimates';
    }

    switch (network?.id) {
      case EthereumNetworkID.ArbSepolia:
        return {
          attestorAPIURLs,
          ethereumExplorerAPIURL: 'https://sepolia.arbiscan.io/tx/',
          ethereumAttestorChainID: 'evm-arbsepolia',
          enabledEthereumNetworks,
          bitcoinExplorerAPIURL,
          bitcoinBlockchainAPIURL,
          bitcoinBlockchainAPIFeeURL,
          bitcoinNetwork,
          bitcoinNetworkName,
        };
      case EthereumNetworkID.Arbitrum:
        return {
          attestorAPIURLs,
          ethereumExplorerAPIURL: 'https://arbiscan.io/tx/',
          ethereumAttestorChainID: 'evm-arbitrum',
          enabledEthereumNetworks,
          bitcoinExplorerAPIURL,
          bitcoinBlockchainAPIURL,
          bitcoinBlockchainAPIFeeURL,
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
    bitcoinBlockchainAPIFeeURL,
    bitcoinNetwork,
    bitcoinNetworkName,
  };
}
