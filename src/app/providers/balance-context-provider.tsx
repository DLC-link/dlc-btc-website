import { createContext, useEffect, useState } from 'react';

import { useEthereum } from '@hooks/use-ethereum';
import { useEthereumContext } from '@hooks/use-ethereum-context';
import { HasChildren } from '@models/has-children';

interface VaultContextType {
  dlcBTCBalance: number | undefined;
  lockedBTCBalance: number | undefined;
}

export const BalanceContext = createContext<VaultContextType>({
  dlcBTCBalance: undefined,
  lockedBTCBalance: undefined,
});

export function BalanceContextProvider({ children }: HasChildren): React.JSX.Element {
  const { contractsLoaded } = useEthereumContext();

  const ethereumHandler = useEthereum();
  const { getDLCBTCBalance, getLockedBTCBalance } = ethereumHandler;

  const [dlcBTCBalance, setDLCBTCBalance] = useState<number | undefined>(undefined);
  const [lockedBTCBalance, setLockedBTCBalance] = useState<number | undefined>(undefined);

  const fetchBalancesIfReady = async () => {
    if (contractsLoaded) {
      const currentTokenBalance = await getDLCBTCBalance();
      if (currentTokenBalance !== dlcBTCBalance) {
        setDLCBTCBalance(currentTokenBalance);
      }
      const currentLockedBTCBalance = await getLockedBTCBalance();
      if (currentLockedBTCBalance !== lockedBTCBalance) {
        setLockedBTCBalance(currentLockedBTCBalance);
      }
    }
  };

  useEffect(() => {
    fetchBalancesIfReady();
  }, [contractsLoaded]);

  return (
    <BalanceContext.Provider value={{ dlcBTCBalance, lockedBTCBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}
