import { useContext, useEffect, useState } from 'react';

import { useLedger } from '@hooks/use-ledger';
import { BitcoinWalletType } from '@models/wallet';
import {
  BitcoinWalletContext,
  BitcoinWalletContextState,
} from '@providers/bitcoin-wallet-context-provider';
import { delay } from 'dlc-btc-lib/utilities';

import { ModalComponentProps } from '../components/modal-container';
import { LedgerModalConnectButton } from './components/ledger-modal-connect-button';
import { LedgerModalErrorBox } from './components/ledger-modal-error-box';
import { LedgerModalLayout } from './components/ledger-modal-layout';
import { LedgerModalLoadingStack } from './components/ledger-modal-loading-stack';
import { LedgerModalSelectAddressMenu } from './components/ledger-modal-select-address-menu/ledger-modal-select-address-menu';
import { LedgerModalSuccessIcon } from './components/ledger-modal-success-icon';

export function LedgerModal({ isOpen, handleClose }: ModalComponentProps): React.JSX.Element {
  const { getLedgerAddressesWithBalances, connectLedgerWallet, isLoading } = useLedger();

  const { setBitcoinWalletType, setBitcoinWalletContextState } = useContext(BitcoinWalletContext);

  const [isSuccesful, setIsSuccesful] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [nativeSegwitAddresses, setNativeSegwitAddresses] = useState<
    [string, number][] | undefined
  >(undefined);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getLedgerNativeSegwitAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  async function getLedgerNativeSegwitAddresses() {
    try {
      setError(undefined);
      const nativeSegwitAddresses = await getLedgerAddressesWithBalances('wpkh');
      setNativeSegwitAddresses(nativeSegwitAddresses);
    } catch (error: any) {
      setError(error.message);
    }
  }

  async function setNativeSegwitAddressAndTaprootMultisigAddress(index: number) {
    try {
      setError(undefined);
      await connectLedgerWallet(index);
      setIsSuccesful(true);
      await delay(2500);
      setIsSuccesful(false);
      setBitcoinWalletType(BitcoinWalletType.Ledger);
      setBitcoinWalletContextState(BitcoinWalletContextState.READY);
      handleClose();
    } catch (error: any) {
      setError(error.message);
    }
  }

  return (
    <LedgerModalLayout logo={'/images/logos/ledger-logo.svg'} isOpen={isOpen} onClose={handleClose}>
      <LedgerModalSuccessIcon isSuccesful={isSuccesful} />
      <LedgerModalConnectButton
        error={error}
        getLedgerNativeSegwitAddresses={getLedgerNativeSegwitAddresses}
      />
      <LedgerModalLoadingStack isLoading={isLoading} />
      <LedgerModalSelectAddressMenu
        nativeSegwitAddresses={nativeSegwitAddresses}
        isLoading={isLoading}
        isSuccesful={isSuccesful}
        error={error}
        setNativeSegwitAddressAndTaprootMultisigAddress={
          setNativeSegwitAddressAndTaprootMultisigAddress
        }
      />
      <LedgerModalErrorBox error={error} />
    </LedgerModalLayout>
  );
}
