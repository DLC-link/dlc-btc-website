import { useContext, useEffect, useState } from 'react';

import { NetworkConfigurationContext } from '@providers/network-configuration.provider';
import { XRPWalletContext, XRPWalletContextState } from '@providers/xrp-wallet-context-provider';
import { useAccount } from 'wagmi';

interface UseNetworkConnectionReturnType {
  isConnected: boolean;
}

export function useNetworkConnection(): UseNetworkConnectionReturnType {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const { networkType } = useContext(NetworkConfigurationContext);

  const { isConnected: isEthereumWalletConnected } = useAccount();
  const { xrpWalletContextState } = useContext(XRPWalletContext);

  useEffect(() => {
    switch (networkType) {
      case 'evm':
        setIsConnected(isEthereumWalletConnected);
        break;
      case 'xrpl':
        setIsConnected(xrpWalletContextState === XRPWalletContextState.READY);
        break;
      default:
        setIsConnected(false);
    }
  }, [networkType, xrpWalletContextState, isEthereumWalletConnected]);

  return { isConnected };
}
