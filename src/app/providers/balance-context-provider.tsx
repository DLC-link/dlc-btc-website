import { createContext, useContext, useEffect, useState } from 'react';

import { HasChildren } from '@models/has-children';
import {
  getAddressDLCBTCBalance,
  getAllAddressVaults,
  getLockedBTCBalance,
} from 'dlc-btc-lib/ethereum-functions';
import { useAccount } from 'wagmi';

import { EthereumNetworkConfigurationContext } from './ethereum-network-configuration.provider';
import { VaultContext } from './vault-context-provider';

interface VaultContextType {
  dlcBTCBalance: number | undefined;
  lockedBTCBalance: number | undefined;
}

export const BalanceContext = createContext<VaultContextType>({
  dlcBTCBalance: undefined,
  lockedBTCBalance: undefined,
});

export function BalanceContextProvider({ children }: HasChildren): React.JSX.Element {
  const { getReadOnlyDLCBTCContract, getReadOnlyDLCManagerContract } = useContext(
    EthereumNetworkConfigurationContext
  );
  const { address: ethereumUserAddress } = useAccount();
  const { fundedVaults } = useContext(VaultContext);

  const [dlcBTCBalance, setDLCBTCBalance] = useState<number | undefined>(undefined);
  const [lockedBTCBalance, setLockedBTCBalance] = useState<number | undefined>(undefined);

  const fetchBalancesIfReady = async (ethereumAddress: string) => {
    const currentTokenBalance = await getAddressDLCBTCBalance(
      getReadOnlyDLCBTCContract(),
      ethereumAddress
    );

    if (currentTokenBalance !== dlcBTCBalance) {
      setDLCBTCBalance(currentTokenBalance);
    }

    const userFundedVaults = await getAllAddressVaults(
      getReadOnlyDLCManagerContract(),
      ethereumAddress
    );
    const currentLockedBTCBalance = await getLockedBTCBalance(userFundedVaults);
    if (currentLockedBTCBalance !== lockedBTCBalance) {
      setLockedBTCBalance(currentLockedBTCBalance);
    }
  };

  useEffect(() => {
    ethereumUserAddress && void fetchBalancesIfReady(ethereumUserAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereumUserAddress, fundedVaults]);

  return (
    <BalanceContext.Provider value={{ dlcBTCBalance, lockedBTCBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}
