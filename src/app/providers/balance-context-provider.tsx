import { createContext, useContext, useEffect, useState } from 'react';

import { HasChildren } from '@models/has-children';
import { getLockedBTCBalance } from 'dlc-btc-lib/ethereum-functions';
import { VaultState } from 'dlc-btc-lib/models';

import { EthereumHandlerContext } from './ethereum-handler-context-provider';
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
  const { ethereumHandler } = useContext(EthereumHandlerContext);
  const { fundedVaults } = useContext(VaultContext);

  const [dlcBTCBalance, setDLCBTCBalance] = useState<number | undefined>(undefined);
  const [lockedBTCBalance, setLockedBTCBalance] = useState<number | undefined>(undefined);

  const fetchBalancesIfReady = async () => {
    if (ethereumHandler) {
      const currentTokenBalance = await ethereumHandler.getUserDLCBTCBalance();
      if (currentTokenBalance !== dlcBTCBalance) {
        setDLCBTCBalance(currentTokenBalance);
      }
      const fundedVaults = (await ethereumHandler.getAllUserVaults()).filter(
        vault => vault.status === VaultState.FUNDED
      );
      const currentLockedBTCBalance = await getLockedBTCBalance(fundedVaults);
      if (currentLockedBTCBalance !== lockedBTCBalance) {
        setLockedBTCBalance(currentLockedBTCBalance);
      }
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchBalancesIfReady();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereumHandler, fundedVaults]);

  return (
    <BalanceContext.Provider value={{ dlcBTCBalance, lockedBTCBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}
