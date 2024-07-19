import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { getEthereumContractWithDefaultNode } from '@functions/configuration.functions';
import { RootState } from '@store/index';
import { getDLCBTCTotalSupply } from 'dlc-btc-lib/ethereum-functions';
import { unshiftValue } from 'dlc-btc-lib/utilities';
import { Contract } from 'ethers';

import { useEthereumConfiguration } from './use-ethereum-configuration';

interface UseTotalSupplyReturnType {
  totalSupply: number | undefined;
}

export function useTotalSupply(): UseTotalSupplyReturnType {
  const { network: ethereumNetwork } = useSelector((state: RootState) => state.account);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [dlcBTCContract, setDLCBTCContract] = useState<Contract | undefined>(undefined);

  const { ethereumContractDeploymentPlans } = useEthereumConfiguration();

  useEffect(() => {
    const dlcBTCContract = getEthereumContractWithDefaultNode(
      ethereumContractDeploymentPlans,
      ethereumNetwork,
      'DLCBTC'
    );
    setDLCBTCContract(dlcBTCContract);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereumNetwork]);

  const fetchTotalSupply = async () => {
    if (!dlcBTCContract) return;
    const totalSupply = await getDLCBTCTotalSupply(dlcBTCContract);

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
