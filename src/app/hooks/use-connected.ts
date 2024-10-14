import { useContext, useEffect, useState } from 'react';

import { NetworkConfigurationContext } from '@providers/network-configuration.provider';
import { RippleNetworkConfigurationContext } from '@providers/ripple-network-configuration.provider';
import { useAccount } from 'wagmi';

interface UseNetworkConnectionReturnType {
  isConnected: boolean;
}

export function useNetworkConnection(): UseNetworkConnectionReturnType {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const { networkType } = useContext(NetworkConfigurationContext);

  const { isConnected: isEthereumWalletConnected } = useAccount();
  const { isRippleWalletConnected } = useContext(RippleNetworkConfigurationContext);

  useEffect(() => {
    switch (networkType) {
      case 'evm':
        setIsConnected(isEthereumWalletConnected);
        break;
      case 'xrpl':
        console.log('isRippleWalletConnected', isRippleWalletConnected);
        setIsConnected(isRippleWalletConnected);
        break;
      default:
        setIsConnected(false);
    }
  }, [networkType, isRippleWalletConnected, isEthereumWalletConnected]);

  return { isConnected };
}
