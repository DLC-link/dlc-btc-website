import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { NetworkConfigurationContext } from '@providers/network-configuration.provider';
import { RippleNetworkConfigurationContext } from '@providers/ripple-network-configuration.provider';
import { useQuery } from '@tanstack/react-query';
import { isUserWhitelisted, isWhitelistingEnabled } from 'dlc-btc-lib/ethereum-functions';
import { useAccount } from 'wagmi';

interface UseActiveTabsReturnType {
  isActiveTabs: boolean;
}

export function useActiveTabs(): UseActiveTabsReturnType {
  const navigate = useNavigate();
  const { chain, address } = useAccount();
  const { isEthereumNetworkConfigurationLoading, ethereumNetworkConfiguration } = useContext(
    EthereumNetworkConfigurationContext
  );

  const { isRippleWalletConnected, isRippleNetworkConfigurationLoading } = useContext(
    RippleNetworkConfigurationContext
  );
  const { networkType } = useContext(NetworkConfigurationContext);

  async function shouldActivateTabs(): Promise<boolean> {
    if (networkType === 'evm') {
      if (!address || !chain) {
        navigate('/mint-withdraw');
        return false;
      }
      const dlcManagerContract = ethereumNetworkConfiguration.dlcManagerContract;
      if (!(await isWhitelistingEnabled(dlcManagerContract))) return true;
      return await isUserWhitelisted(dlcManagerContract, address);
    } else {
      navigate('/mint-withdraw');
      return isRippleWalletConnected;
    }
  }

  const { data: isActiveTabs } = useQuery({
    queryKey: ['activeTabs', chain, address, networkType, isRippleWalletConnected],
    queryFn: shouldActivateTabs,
    enabled:
      networkType === 'evm'
        ? !isEthereumNetworkConfigurationLoading
        : !isRippleNetworkConfigurationLoading,
  });

  return {
    isActiveTabs: isActiveTabs ?? false,
  };
}
