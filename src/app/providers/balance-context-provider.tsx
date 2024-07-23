import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getEthereumContractWithProvider } from '@functions/configuration.functions';
import { HasChildren } from '@models/has-children';
import { RootState } from '@store/index';
import {
  getAddressDLCBTCBalance,
  getAllAddressVaults,
  getLockedBTCBalance,
} from 'dlc-btc-lib/ethereum-functions';

import { EthereumNetworkConfigurationContext } from './ethereum-network-configuration.provider';

interface VaultContextType {
  dlcBTCBalance: number | undefined;
  lockedBTCBalance: number | undefined;
}

export const BalanceContext = createContext<VaultContextType>({
  dlcBTCBalance: undefined,
  lockedBTCBalance: undefined,
});

export function BalanceContextProvider({ children }: HasChildren): React.JSX.Element {
  const { ethereumContractDeploymentPlans } = useContext(EthereumNetworkConfigurationContext);
  const { address: ethereumUserAddress, network: ethereumNetwork } = useSelector(
    (state: RootState) => state.account
  );

  const [dlcBTCBalance, setDLCBTCBalance] = useState<number | undefined>(undefined);
  const [lockedBTCBalance, setLockedBTCBalance] = useState<number | undefined>(undefined);

  const fetchBalancesIfReady = async (ethereumAddress: string) => {
    const dlcManagerContract = getEthereumContractWithProvider(
      ethereumContractDeploymentPlans,
      ethereumNetwork,
      'DLCManager'
    );

    const dlcBTCContract = getEthereumContractWithProvider(
      ethereumContractDeploymentPlans,
      ethereumNetwork,
      'DLCBTC'
    );

    const currentTokenBalance = await getAddressDLCBTCBalance(dlcBTCContract, ethereumAddress);

    if (currentTokenBalance !== dlcBTCBalance) {
      setDLCBTCBalance(currentTokenBalance);
    }

    const userFundedVaults = await getAllAddressVaults(dlcManagerContract, ethereumAddress);
    const currentLockedBTCBalance = await getLockedBTCBalance(userFundedVaults);
    if (currentLockedBTCBalance !== lockedBTCBalance) {
      setLockedBTCBalance(currentLockedBTCBalance);
    }
  };

  useEffect(() => {
    ethereumUserAddress && void fetchBalancesIfReady(ethereumUserAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereumUserAddress]);

  return (
    <BalanceContext.Provider value={{ dlcBTCBalance, lockedBTCBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}
