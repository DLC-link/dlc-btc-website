import { useContext, useEffect, useState } from 'react';

import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { useQuery } from '@tanstack/react-query';
import { getDLCBTCTotalSupply } from 'dlc-btc-lib/ethereum-functions';
import { unshiftValue } from 'dlc-btc-lib/utilities';
import { useAccount } from 'wagmi';

interface UseTotalSupplyReturnType {
  totalSupply: number | undefined;
}

export function useTotalSupply(): UseTotalSupplyReturnType {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { chainId } = useAccount();

  const { ethereumNetworkConfiguration } = useContext(EthereumNetworkConfigurationContext);

  const fetchTotalSupply = async () => {
    const totalSupply = await getDLCBTCTotalSupply(ethereumNetworkConfiguration.dlcBTCContract);

    return unshiftValue(totalSupply);
  };

  const { data: totalSupply } = useQuery({
    queryKey: ['totalSupply', chainId, ethereumNetworkConfiguration.dlcBTCContract.address],
    queryFn: fetchTotalSupply,
    enabled: shouldFetch,
    refetchInterval: 60000,
  });

  useEffect(() => {
    const delayFetching = setTimeout(() => {
      setShouldFetch(true);
    }, 3500);
    return () => clearTimeout(delayFetching);
  }, []);

  return {
    totalSupply,
  };
}
