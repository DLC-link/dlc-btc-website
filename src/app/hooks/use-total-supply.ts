import { useContext, useEffect, useState } from 'react';

import { mainnetContract } from '@functions/configuration.functions';
import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { useQuery } from '@tanstack/react-query';
import { getDLCBTCTotalSupply } from 'dlc-btc-lib/ethereum-functions';
import { unshiftValue } from 'dlc-btc-lib/utilities';

interface UseTotalSupplyReturnType {
  totalSupply: number | undefined;
}

export function useTotalSupply(): UseTotalSupplyReturnType {
  const [shouldFetch, setShouldFetch] = useState(false);

  const { enabledEthereumNetworkConfigurations } = useContext(EthereumNetworkConfigurationContext);

  const fetchTotalSupply = async () => {
    let totalSupply = (
      await Promise.all(
        enabledEthereumNetworkConfigurations.map(async ethereumNetworkConfiguration => {
          return await getDLCBTCTotalSupply(ethereumNetworkConfiguration.dlcBTCContract);
        })
      )
    ).reduce((acc, supply) => acc + supply, 0);
    if (appConfiguration.appEnvironment === 'mainnet') {
      totalSupply += await getDLCBTCTotalSupply(mainnetContract);
    }
    return unshiftValue(totalSupply);
  };

  const { data: totalSupply } = useQuery({
    queryKey: ['totalSupply'],
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
