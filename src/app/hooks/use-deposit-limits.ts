import { useContext } from 'react';

import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { useQuery } from '@tanstack/react-query';
import { unshiftValue } from 'dlc-btc-lib/utilities';
import { BigNumber } from 'ethers';

interface UseDepositLimitsReturnType {
  depositLimit: { minimumDeposit: number; maximumDeposit: number } | undefined;
}

export function useDepositLimits(): UseDepositLimitsReturnType {
  const { ethereumNetworkConfiguration } = useContext(EthereumNetworkConfigurationContext);

  async function fetchDepositLimit(): Promise<
    { minimumDeposit: number; maximumDeposit: number } | undefined
  > {
    try {
      const minimumDeposit: BigNumber =
        await ethereumNetworkConfiguration.dlcManagerContract.minimumDeposit();
      const maximumDeposit: BigNumber =
        await ethereumNetworkConfiguration.dlcManagerContract.maximumDeposit();

      return {
        minimumDeposit: unshiftValue(minimumDeposit.toNumber()),
        maximumDeposit: unshiftValue(maximumDeposit.toNumber()),
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error fetching deposit limits`, error);
      return undefined;
    }
  }

  const { data: depositLimit } = useQuery({
    queryKey: ['depositLimit', ethereumNetworkConfiguration.dlcBTCContract.address],
    queryFn: fetchDepositLimit,
    enabled: !!ethereumNetworkConfiguration,
  });

  return {
    depositLimit,
  };
}
