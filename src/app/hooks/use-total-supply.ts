import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { EthereumError } from '@models/error-types';
import { EthereumNetwork } from '@models/ethereum-network';
import { unshiftValue } from 'dlc-btc-lib/utilities';

import { useEthereum } from './use-ethereum';
import { useEthereumConfiguration } from './use-ethereum-configuration';

interface UseTotalSupplyReturnType {
  totalSupply: number | undefined;
}

export function useTotalSupply(): UseTotalSupplyReturnType {
  const { enabledEthereumNetworks } = useEthereumConfiguration();
  const { getDefaultProvider } = useEthereum();

  const [shouldFetch, setShouldFetch] = useState(false);

  const fetchTotalSupply = async () => {
    const supplies = await Promise.all(
      enabledEthereumNetworks.map(network => getTotalSupply(network))
    );

    const totalSupply = supplies.reduce((a, b) => a + b, 0);

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

  async function getTotalSupply(ethereumNetwork: EthereumNetwork): Promise<number> {
    try {
      const protocolContract = await getDefaultProvider(ethereumNetwork, 'DLCBTC');

      const totalSupply = await protocolContract.totalSupply();

      return totalSupply.toNumber();
    } catch (error) {
      throw new EthereumError(
        `Could not fetch Total Supply Info for ${ethereumNetwork.name} : ${error}}`
      );
    }
  }

  return {
    totalSupply,
  };
}
