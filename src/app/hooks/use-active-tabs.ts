import { useContext } from 'react';

import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

interface UseActiveTabsReturnType {
  isActiveTabs: boolean;
}

export function useActiveTabs(): UseActiveTabsReturnType {
  // const navigate = useNavigate();
  const { chain, address } = useAccount();
  const { isEthereumNetworkConfigurationLoading } = useContext(EthereumNetworkConfigurationContext);

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
