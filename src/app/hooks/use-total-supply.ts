import { useContext } from 'react';
import { useQuery } from 'react-query';

import { EthereumHandlerContext } from '@providers/ethereum-handler-context-provider';
import { unshiftValue } from 'dlc-btc-lib/utilities';

interface UseTotalSupplyReturnType {
  totalSupply: number | undefined;
}

export function useTotalSupply(): UseTotalSupplyReturnType {
  const { readOnlyEthereumHandler } = useContext(EthereumHandlerContext);

  const fetchTotalSupply = async () => {
    if (!readOnlyEthereumHandler) return;

    return unshiftValue(await readOnlyEthereumHandler.getContractTotalSupply());
  };

  const { data: totalSupply } = useQuery(['totalSupply'], fetchTotalSupply, {
    enabled: !!readOnlyEthereumHandler,
    refetchInterval: 60000,
  });

  return {
    totalSupply,
  };
}
