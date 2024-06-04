import { createContext, useState } from 'react';

import { HasChildren } from '@models/has-children';
import { BitcoinWalletType } from '@models/wallet';
import { LedgerDLCHandler, SoftwareWalletDLCHandler } from 'dlc-btc-lib';

export enum BitcoinWalletContextState {
  INITIAL = 0,
  SELECTED = 1,
  READY = 2,
}

interface BitcoinWalletContextProviderType {
  bitcoinWalletType: BitcoinWalletType | undefined;
  setBitcoinWalletType: React.Dispatch<React.SetStateAction<BitcoinWalletType | undefined>>;
  bitcoinWalletContextState: BitcoinWalletContextState;
  setBitcoinWalletContextState: React.Dispatch<React.SetStateAction<BitcoinWalletContextState>>;
  dlcHandler: SoftwareWalletDLCHandler | LedgerDLCHandler | undefined;
  setDLCHandler: React.Dispatch<
    React.SetStateAction<SoftwareWalletDLCHandler | LedgerDLCHandler | undefined>
  >;
  resetBitcoinWalletContext: () => void;
}

export const BitcoinWalletContext = createContext<BitcoinWalletContextProviderType>({
  bitcoinWalletType: undefined,
  setBitcoinWalletType: () => {},
  bitcoinWalletContextState: BitcoinWalletContextState.INITIAL,
  setBitcoinWalletContextState: () => {},
  dlcHandler: undefined,
  setDLCHandler: () => {},
  resetBitcoinWalletContext: () => {},
});

export function BitcoinWalletContextProvider({ children }: HasChildren): React.JSX.Element {
  const [bitcoinWalletContextState, setBitcoinWalletContextState] =
    useState<BitcoinWalletContextState>(BitcoinWalletContextState.INITIAL);
  const [bitcoinWalletType, setBitcoinWalletType] = useState<BitcoinWalletType | undefined>(
    BitcoinWalletType.Leather
  );
  const [dlcHandler, setDLCHandler] = useState<SoftwareWalletDLCHandler | LedgerDLCHandler>();

  function resetBitcoinWalletContext() {
    setBitcoinWalletContextState(BitcoinWalletContextState.INITIAL);
    setBitcoinWalletType(undefined);
    setDLCHandler(undefined);
  }

  return (
    <BitcoinWalletContext.Provider
      value={{
        bitcoinWalletType,
        setBitcoinWalletType,
        bitcoinWalletContextState,
        setBitcoinWalletContextState,
        dlcHandler,
        setDLCHandler,
        resetBitcoinWalletContext,
      }}
    >
      {children}
    </BitcoinWalletContext.Provider>
  );
}
