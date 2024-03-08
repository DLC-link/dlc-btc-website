import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useBlockchainContext } from '@hooks/use-blockchain-context';
import { HasChildren } from '@models/has-children';
import { RootState } from '@store/index';

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
  const { address } = useSelector((state: RootState) => state.account);

  const blockchainContext = useBlockchainContext();
  const { ethereum } = blockchainContext;
  const { getDLCBTCBalance, getLockedBTCBalance, isLoaded } = ethereum;

  const { vaults } = useContext(VaultContext);

  const [dlcBTCBalance, setDLCBTCBalance] = useState<number | undefined>(undefined);
  const [lockedBTCBalance, setLockedBTCBalance] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!address) return;

    if (!isLoaded) return;

    const fetchData = async () => {
      const currentTokenBalance = await getDLCBTCBalance();
      if (currentTokenBalance !== dlcBTCBalance) {
        setDLCBTCBalance(currentTokenBalance);
      }
      const currentLockedBTCBalance = await getLockedBTCBalance();
      if (currentLockedBTCBalance !== lockedBTCBalance) {
        setLockedBTCBalance(currentLockedBTCBalance);
      }
    };
    fetchData();
  }, [address, vaults, isLoaded]);

  return (
    <BalanceContext.Provider value={{ dlcBTCBalance, lockedBTCBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}
