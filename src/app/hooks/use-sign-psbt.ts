import { useEffect, useState } from 'react';

import { BitcoinError } from '@models/error-types';
import * as btc from '@scure/btc-signer';

import { UseBitcoinReturnType } from './use-bitcoin';

export interface UseSignPSBTReturnType {
  handleSignTransaction: (btcAmount: number) => Promise<void>;
  fundingTransactionSigned: boolean;
  closingTransactionSigned: boolean;
}

export function useSignPSBT(useBitcoin?: UseBitcoinReturnType): UseSignPSBTReturnType {
  if (!useBitcoin) throw new Error('useBitcoin must be set before useSignPSBT can be used');

  const { signAndBroadcastFundingPSBT, signClosingPSBT } = useBitcoin;
  const [btcAmount, setBTCAmount] = useState<number | undefined>();
  const [fundingTransactionSigned, setFundingTransactionSigned] = useState(false);
  const [closingTransactionSigned, setClosingTransactionSigned] = useState(false);
  const [fundingTransactionID, setFundingTransactionID] = useState<string | undefined>();
  const [multisigTransaction, setMultisigTransaction] = useState<btc.P2TROut | undefined>();
  const [userNativeSegwitAddress, setUserNativeSegwitAddress] = useState<string | undefined>();

  useEffect(() => {
    if (
      fundingTransactionSigned &&
      btcAmount &&
      fundingTransactionID &&
      multisigTransaction &&
      userNativeSegwitAddress
    ) {
      handleSignClosingTransaction();
    }
  }, [
    fundingTransactionSigned,
    btcAmount,
    fundingTransactionID,
    multisigTransaction,
    userNativeSegwitAddress,
  ]);

  async function handleSignFundingTransaction(btcAmount: number) {
    try {
      const { fundingTransactionID, multisigTransaction, userNativeSegwitAddress } =
        await signAndBroadcastFundingPSBT(btcAmount);
      setBTCAmount(btcAmount);
      setFundingTransactionID(fundingTransactionID);
      setMultisigTransaction(multisigTransaction);
      setUserNativeSegwitAddress(userNativeSegwitAddress);
      setFundingTransactionSigned(true);
    } catch (error) {
      throw new BitcoinError(`Error signing funding transaction: ${error}`);
    }
  }

  async function handleSignClosingTransaction() {
    try {
      if (!fundingTransactionID || !multisigTransaction || !userNativeSegwitAddress || !btcAmount) {
        throw new Error(
          'Funding transaction must be signed before closing transaction can be signed'
        );
      }
      await signClosingPSBT(
        fundingTransactionID,
        multisigTransaction,
        userNativeSegwitAddress,
        btcAmount
      );
      setClosingTransactionSigned(true);
    } catch (error) {
      throw new BitcoinError(`Error signing closing transaction: ${error}`);
    }
  }

  async function handleSignTransaction(btcAmount: number) {
    setBTCAmount(btcAmount);
    if (!fundingTransactionSigned) {
      await handleSignFundingTransaction(btcAmount);
    } else {
      await handleSignClosingTransaction();
    }
  }

  return { handleSignTransaction, fundingTransactionSigned, closingTransactionSigned };
}
