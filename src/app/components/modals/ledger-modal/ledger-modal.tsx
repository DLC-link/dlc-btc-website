import { useContext, useEffect, useState } from 'react';

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

  const [nativeSegwitAddresses, setNativeSegwitAddresses] = useState<
    [number, string, number][] | undefined
  >(undefined);
  const [taprootAddresses, setTaprootAddresses] = useState<[number, string, number][] | undefined>(
    undefined
  );

  const [isSuccesful, setIsSuccesful] = useState(false);
  const [isLoadingAddressList, setIsLoadingAddressList] = useState(true);
  const [ledgerError, setLedgerError] = useState<string | undefined>(undefined);

  const [walletAccountIndex, setWalletAccountIndex] = useState(0);
  const [displayedAddressesStartIndex, setDisplayedAddressesStartIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      void getLedgerAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, displayedAddressesStartIndex, walletAccountIndex]);

  async function getLedgerAddresses() {
    try {
      setLedgerError(undefined);
      setIsLoadingAddressList(true);
      const nativeSegwitAddresses = await getLedgerAddressesWithBalances(
        SupportedPaymentType.NATIVE_SEGWIT,
        walletAccountIndex,
        displayedAddressesStartIndex
      );

      const taprootAddresses = await getLedgerAddressesWithBalances(
        SupportedPaymentType.TAPROOT,
        walletAccountIndex,
        displayedAddressesStartIndex
      );

      setNativeSegwitAddresses(nativeSegwitAddresses);
      setTaprootAddresses(taprootAddresses);
      setIsLoadingAddressList(false);
    } catch (error: any) {
      setLedgerError(error.message);
    }
  }

  function resetLedgerModalValues() {
    setIsSuccesful(false);
    setNativeSegwitAddresses(undefined);
    setTaprootAddresses(undefined);
    setIsLoadingAddressList(true);
    setLedgerError(undefined);
    setWalletAccountIndex(0);
    setDisplayedAddressesStartIndex(0);
  }

  async function setFundingAndTaprootAddress(
    addressIndex: number,
    paymentType: SupportedPaymentType
  ) {
    try {
      await connectLedgerWallet(Number(walletAccountIndex), addressIndex, paymentType);
      setIsSuccesful(true);
      await delay(2500);
      resetLedgerModalValues();
      setBitcoinWalletType(BitcoinWalletType.Ledger);
      setBitcoinWalletContextState(BitcoinWalletContextState.READY);
      handleClose();
    } catch (error: any) {
      setLedgerError(error.message);
    }
  }

  return (
    <LedgerModalLayout logo={'/images/logos/ledger-logo.svg'} isOpen={isOpen} onClose={handleClose}>
      <LedgerModalSuccessIcon isSuccesful={isSuccesful} />
      <LedgerModalConnectButton error={ledgerError} getLedgerAddresses={getLedgerAddresses} />
      <LedgerModalLoadingStack isLoading={isLoading} />
      <LedgerModalSelectAddressMenu
        nativeSegwitAddresses={nativeSegwitAddresses}
        taprootAddresses={taprootAddresses}
        isLoading={isLoadingAddressList}
        isSuccesful={isSuccesful}
        error={ledgerError}
        displayedAddressesStartIndex={displayedAddressesStartIndex}
        setDisplayedAddressesStartIndex={setDisplayedAddressesStartIndex}
        walletAccountIndex={walletAccountIndex}
        setWalletAccountIndex={setWalletAccountIndex}
        setFundingAndTaprootAddress={setFundingAndTaprootAddress}
      />
      <LedgerModalErrorBox error={ledgerError} />
    </LedgerModalLayout>
  );
}
