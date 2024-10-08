import { useContext, useEffect, useState } from 'react';

import { NetworkConfigurationContext } from '@providers/network-configuration.provider';
import { RippleNetworkConfigurationContext } from '@providers/ripple-network-configuration.provider';
import { useAccount } from 'wagmi';

export function useConnected(): boolean {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const { isConnected: isEthereumWalletConnected } = useAccount();
  const { isRippleWalletConnected } = useContext(RippleNetworkConfigurationContext);
  const { networkType } = useContext(NetworkConfigurationContext);

  useEffect(() => {
    if (networkType === 'evm') {
      setIsConnected(isEthereumWalletConnected);
    } else {
      setIsConnected(isRippleWalletConnected);
    }
  }, [networkType, isRippleWalletConnected, isEthereumWalletConnected]);

  return isConnected;
}
