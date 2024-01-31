import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { EthereumNetwork } from '@models/network';
import { RootState } from '@store/index';

interface UseEndpointsReturnType {
  routerWalletURL: string | undefined;
  ethereumExplorerAPIURL: string | undefined;
  bitcoinExplorerAPIURL: string | undefined;
}

export function useEndpoints(): UseEndpointsReturnType {
  const { network } = useSelector((state: RootState) => state.account);

  const [routerWalletURL, setRouterWalletURL] = useState<string | undefined>(undefined);
  const [ethereumExplorerAPIURL, setEthereumExplorerAPIURL] = useState<string | undefined>(
    undefined
  );
  const [bitcoinExplorerAPIURL, setBitcoinExplorerAPIURL] = useState<string>('');

  useEffect(() => {
    if (!network) return;

    const { routerWalletURL, ethereumExplorerAPIURL, bitcoinExplorerAPIURL } = getEndpoints();

    setRouterWalletURL(routerWalletURL);
    setEthereumExplorerAPIURL(ethereumExplorerAPIURL);
    setBitcoinExplorerAPIURL(bitcoinExplorerAPIURL);
  }, [network]);

  function getEndpoints(): {
    routerWalletURL: string;
    ethereumExplorerAPIURL: string;
    bitcoinExplorerAPIURL: string;
  } {
    switch (network?.id) {
      case EthereumNetwork.Sepolia:
        return {
          routerWalletURL: 'https://testnet.dlc.link/wallet',
          ethereumExplorerAPIURL: 'https://sepolia.etherscan.io/tx/',
          bitcoinExplorerAPIURL: 'http://testnet.dlc.link/electrs/tx/',
        };
      case EthereumNetwork.X1Testnet:
        return {
          routerWalletURL: 'https://devnet.dlc.link/wallet',
          ethereumExplorerAPIURL: 'https://www.oklink.com/x1-test/tx/',
          bitcoinExplorerAPIURL: 'http://devnet.dlc.link/electrs/tx/',
        };
      default:
        throw new Error(`Unsupported network: ${network?.name}`);
    }
  }
  return { routerWalletURL, ethereumExplorerAPIURL, bitcoinExplorerAPIURL };
}
