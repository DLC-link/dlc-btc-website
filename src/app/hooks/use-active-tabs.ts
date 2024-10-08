import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
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

  async function shouldActivateTabs(): Promise<boolean> {
    // if (!address || !chain) {
    //   navigate('/');
    //   return false;
    // }
    // const dlcManagerContract = ethereumNetworkConfiguration.dlcManagerContract;
    // if (!(await isWhitelistingEnabled(dlcManagerContract))) return true;
    // return await isUserWhitelisted(dlcManagerContract, address);
    return true;
  }

  const { data: isActiveTabs } = useQuery({
    queryKey: ['activeTabs', chain, address],
    queryFn: shouldActivateTabs,
    enabled: !isEthereumNetworkConfigurationLoading,
  });

  return {
    isActiveTabs: isActiveTabs ?? false,
  };
}
