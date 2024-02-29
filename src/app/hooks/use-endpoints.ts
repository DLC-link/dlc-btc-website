import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { EthereumNetwork } from '@models/network';
import { RootState } from '@store/index';

interface NetworkEndpoints {
  attestorAPIURL: string;
  ethereumExplorerAPIURL: string;
  bitcoinExplorerAPIURL: string;
  bitcoinBlockchainAPIURL: string;
}

export function useEndpoints(): NetworkEndpoints {
  const { network } = useSelector((state: RootState) => state.account);

  const [attestorAPIURL, setAttestorAPIURL] = useState<string>('');
  const [ethereumExplorerAPIURL, setEthereumExplorerAPIURL] = useState<string>('');
  const [bitcoinExplorerAPIURL, setBitcoinExplorerAPIURL] = useState<string>('');
  const [bitcoinBlockchainAPIURL, setBitcoinBlockchainAPIURL] = useState<string>('');

  useEffect(() => {
    if (!network) return;

    const {
      attestorAPIURL,
      ethereumExplorerAPIURL,
      bitcoinExplorerAPIURL,
      bitcoinBlockchainAPIURL,
    } = getEndpoints();

    setAttestorAPIURL(attestorAPIURL);
    setEthereumExplorerAPIURL(ethereumExplorerAPIURL);
    setBitcoinExplorerAPIURL(bitcoinExplorerAPIURL);
    setBitcoinBlockchainAPIURL(bitcoinBlockchainAPIURL);
  }, [network]);

  function getEndpoints(): NetworkEndpoints {
    switch (network?.id) {
      case EthereumNetwork.Sepolia:
        return {
          attestorAPIURL: 'http://localhost:8811',
          ethereumExplorerAPIURL: 'https://sepolia.etherscan.io/tx/',
          bitcoinExplorerAPIURL: 'http://devnet.dlc.link/electrs/tx/',
          bitcoinBlockchainAPIURL: 'https://devnet.dlc.link/electrs',
        };
      case EthereumNetwork.Goerli:
        return {
          attestorAPIURL: 'http://localhost:8811',
          ethereumExplorerAPIURL: 'https://goerli.etherscan.io/tx/',
          bitcoinExplorerAPIURL: 'https://blockstream.info/testnet/tx/',
          bitcoinBlockchainAPIURL: 'https://devnet.dlc.link/electrs',
        };
      case EthereumNetwork.X1Testnet:
        return {
          attestorAPIURL: 'http://localhost:8811',
          ethereumExplorerAPIURL: 'https://www.oklink.com/x1-test/tx/',
          bitcoinExplorerAPIURL: 'http://devnet.dlc.link/electrs/tx/',
          bitcoinBlockchainAPIURL: 'https://devnet.dlc.link/electrs',
        };
      default:
        throw new Error(`Unsupported network: ${network?.name}`);
    }
  }
  return { attestorAPIURL, ethereumExplorerAPIURL, bitcoinExplorerAPIURL, bitcoinBlockchainAPIURL };
}
