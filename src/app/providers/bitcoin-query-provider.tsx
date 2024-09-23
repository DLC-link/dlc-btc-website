import { createContext } from 'react';

import { useConfirmationChecker } from '@hooks/use-confirmation-checker';
import { HasChildren } from '@models/has-children';

interface BitcoinTransactionConfirmationsProviderType {
  bitcoinTransactionConfirmations: [string, number][];
}

export const BitcoinTransactionConfirmationsContext =
  createContext<BitcoinTransactionConfirmationsProviderType>({
    bitcoinTransactionConfirmations: [],
  });

export function BitcoinTransactionConfirmationsProvider({
  children,
}: HasChildren): React.JSX.Element {
  const bitcoinTransactionConfirmations = useConfirmationChecker();

  return (
    <BitcoinTransactionConfirmationsContext.Provider value={{ bitcoinTransactionConfirmations }}>
      {children}
    </BitcoinTransactionConfirmationsContext.Provider>
  );
}
