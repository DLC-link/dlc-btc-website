import { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { getDLCBTCTotalSupply } from 'dlc-btc-lib/ethereum-functions';
import { unshiftValue } from 'dlc-btc-lib/utilities';

interface UseTotalSupplyReturnType {
  totalSupply: number | undefined;
}

export function useTotalSupply(): UseTotalSupplyReturnType {
  const [shouldFetch, setShouldFetch] = useState(false);

  const { getReadOnlyDLCBTCContract } = useContext(EthereumNetworkConfigurationContext);

  const fetchTotalSupply = async () => {
    const totalSupply = await getDLCBTCTotalSupply(getReadOnlyDLCBTCContract());

    return unshiftValue(totalSupply);
  };

  const { data: totalSupply } = useQuery(['totalSupply'], fetchTotalSupply, {
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
