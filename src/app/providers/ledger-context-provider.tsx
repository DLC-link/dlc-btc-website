import { createContext, useState } from 'react';

import { HasChildren } from '@models/has-children';
import { BitcoinWalletType } from '@models/wallet';
import { P2Ret, P2TROut } from '@scure/btc-signer';
import { DefaultWalletPolicy, WalletPolicy } from 'ledger-bitcoin';

export enum BitcoinWalletContextState {
  INITIAL = 0,
  SELECT_BITCOIN_WALLET_READY = 1,
  NATIVE_SEGWIT_ADDRESS_READY = 2,
  TAPROOT_MULTISIG_ADDRESS_READY = 3,
}

export interface TaprootMultisigAddressInformation {
  taprootMultisigPayment: P2TROut;
  userTaprootMultisigDerivedPublicKey: Buffer;
  taprootMultisigAccountPolicy?: WalletPolicy;
  taprootMultisigPolicyHMac?: Buffer;
}

export interface NativeSegwitAddressInformation {
  nativeSegwitPayment: P2Ret;
  nativeSegwitDerivedPublicKey: Buffer;
  nativeSegwitAccountPolicy?: DefaultWalletPolicy;
}

interface BitcoinWalletContextProviderType {
  bitcoinWalletType: BitcoinWalletType | undefined;
  setBitcoinWalletType: React.Dispatch<React.SetStateAction<BitcoinWalletType | undefined>>;
  bitcoinWalletContextState: BitcoinWalletContextState;
  setBitcoinWalletContextState: React.Dispatch<React.SetStateAction<BitcoinWalletContextState>>;
  taprootMultisigAddressInformation: TaprootMultisigAddressInformation | undefined;
  setTaprootMultisigAddressInformation: React.Dispatch<
    React.SetStateAction<TaprootMultisigAddressInformation | undefined>
  >;
  nativeSegwitAddressInformation: NativeSegwitAddressInformation | undefined;
  setNativeSegwitAddressInformation: React.Dispatch<
    React.SetStateAction<NativeSegwitAddressInformation | undefined>
  >;
}

export const BitcoinWalletContext = createContext<BitcoinWalletContextProviderType>({
  bitcoinWalletType: undefined,
  setBitcoinWalletType: () => {},
  bitcoinWalletContextState: BitcoinWalletContextState.INITIAL,
  setBitcoinWalletContextState: () => {},
  taprootMultisigAddressInformation: undefined,
  setTaprootMultisigAddressInformation: () => {},
  nativeSegwitAddressInformation: undefined,
  setNativeSegwitAddressInformation: () => {},
});

export function BitcoinWalletContextProvider({ children }: HasChildren): React.JSX.Element {
  const [bitcoinWalletContextState, setBitcoinWalletContextState] =
    useState<BitcoinWalletContextState>(BitcoinWalletContextState.INITIAL);
  const [bitcoinWalletType, setBitcoinWalletType] = useState<BitcoinWalletType | undefined>(
    BitcoinWalletType.Leather
  );
  const [taprootMultisigAddressInformation, setTaprootMultisigAddressInformation] = useState<
    TaprootMultisigAddressInformation | undefined
  >(undefined);
  const [nativeSegwitAddressInformation, setNativeSegwitAddressInformation] = useState<
    NativeSegwitAddressInformation | undefined
  >(undefined);

  return (
    <BitcoinWalletContext.Provider
      value={{
        bitcoinWalletType,
        setBitcoinWalletType,
        bitcoinWalletContextState,
        setBitcoinWalletContextState,
        taprootMultisigAddressInformation,
        setTaprootMultisigAddressInformation,
        nativeSegwitAddressInformation,
        setNativeSegwitAddressInformation,
      }}
    >
      {children}
    </BitcoinWalletContext.Provider>
  );
}
