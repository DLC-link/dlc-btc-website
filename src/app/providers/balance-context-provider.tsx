import { createContext, useContext, useEffect, useState } from 'react';

import { getLockedBTCBalance } from '@functions/vault.functions';
import { useVaults } from '@hooks/use-vaults';
import { HasChildren } from '@models/has-children';

import { EthereumHandlerContext } from './ethereum-handler-context-provider';

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
  const { fundedVaults } = useVaults();

  const [dlcBTCBalance, setDLCBTCBalance] = useState<number | undefined>(undefined);
  const [lockedBTCBalance, setLockedBTCBalance] = useState<number | undefined>(undefined);

  const fetchBalancesIfReady = async () => {
    if (ethereumHandler) {
      const currentTokenBalance = await ethereumHandler.getDLCBTCBalance();
      if (currentTokenBalance !== dlcBTCBalance) {
        setDLCBTCBalance(currentTokenBalance);
      }
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
