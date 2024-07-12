import { useContext, useEffect, useState } from 'react';

import { Button } from '@chakra-ui/react';
import { useLedger } from '@hooks/use-ledger';
import { SupportedPaymentType } from '@models/supported-payment-types';
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
  const [taprootAddresses, setTaprootAddresses] = useState<[string, number][] | undefined>(
    undefined
  );
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getLedgerAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, startIndex]);

  async function getLedgerAddresses() {
    try {
      setError(undefined);
      const nativeSegwitAddresses = await getLedgerAddressesWithBalances(
        SupportedPaymentType.NATIVE_SEGWIT,
        0,
        startIndex
      );
      const taprootAddresses = await getLedgerAddressesWithBalances(
        SupportedPaymentType.TAPROOT,
        0,
        startIndex
      );
      setNativeSegwitAddresses(nativeSegwitAddresses);
      setTaprootAddresses(taprootAddresses);
    } catch (error: any) {
      setError(error.message);
    }
  }

  async function setFundingAndTaprootAddress(index: number, paymentType: SupportedPaymentType) {
    try {
      setError(undefined);
      await connectLedgerWallet(index, paymentType);
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
      <LedgerModalConnectButton error={error} getLedgerAddresses={getLedgerAddresses} />
      <LedgerModalLoadingStack isLoading={isLoading} />
      <LedgerModalSelectAddressMenu
        nativeSegwitAddresses={nativeSegwitAddresses}
        taprootAddresses={taprootAddresses}
        isLoading={isLoading}
        isSuccesful={isSuccesful}
        error={error}
        startIndex={startIndex}
        setStartIndex={setStartIndex}
        setFundingAndTaprootAddress={setFundingAndTaprootAddress}
      />
      <LedgerModalErrorBox error={error} />
    </LedgerModalLayout>
  );
}
