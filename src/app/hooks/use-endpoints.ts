import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { EthereumNetwork } from '@models/network';
import { RootState } from '@store/index';

interface NetworkEndpoints {
  attestorAPIURLs: string[];
  ethereumExplorerAPIURL: string;
  bitcoinExplorerAPIURL: string;
  bitcoinBlockchainAPIURL: string;
}

export function useEndpoints(): NetworkEndpoints {
  const { network } = useSelector((state: RootState) => state.account);

  const [attestorAPIURLs, setAttestorAPIURLs] = useState<string[]>([]);
  const [ethereumExplorerAPIURL, setEthereumExplorerAPIURL] = useState<string>('');
  const [bitcoinExplorerAPIURL, setBitcoinExplorerAPIURL] = useState<string>('');
  const [bitcoinBlockchainAPIURL, setBitcoinBlockchainAPIURL] = useState<string>('');

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
  }, [network]);

  function getEndpoints(): NetworkEndpoints {
    switch (network?.id) {
      case EthereumNetwork.Sepolia:
        return {
          attestorAPIURLs: [
            'https://devnet.dlc.link/attestor-1',
            'https://devnet.dlc.link/attestor-2',
            'https://devnet.dlc.link/attestor-3',
          ],
          ethereumExplorerAPIURL: 'https://sepolia.etherscan.io/tx/',
          bitcoinExplorerAPIURL: 'http://devnet.dlc.link/electrs/tx/',
          bitcoinBlockchainAPIURL: 'https://devnet.dlc.link/electrs',
        };
      case EthereumNetwork.Goerli:
        return {
          attestorAPIURLs: [
            'http://localhost:8811',
            'http://localhost:8812',
            'http://localhost:8813',
          ],
          ethereumExplorerAPIURL: 'https://goerli.etherscan.io/tx/',
          bitcoinExplorerAPIURL: 'https://blockstream.info/testnet/tx/',
          bitcoinBlockchainAPIURL: 'https://devnet.dlc.link/electrs',
        };
      case EthereumNetwork.X1Testnet:
        return {
          attestorAPIURLs: [
            'http://localhost:8811',
            'http://localhost:8812',
            'http://localhost:8813',
          ],
          ethereumExplorerAPIURL: 'https://www.oklink.com/x1-test/tx/',
          bitcoinExplorerAPIURL: 'http://devnet.dlc.link/electrs/tx/',
          bitcoinBlockchainAPIURL: 'https://devnet.dlc.link/electrs',
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
  };
}
