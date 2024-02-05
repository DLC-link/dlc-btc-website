import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { customShiftValue } from '@common/utilities';
import { BitcoinError } from '@models/error-types';
import * as btc from '@scure/btc-signer';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { vaultActions } from '@store/slices/vault/vault.actions';

import { UseBitcoinReturnType } from './use-bitcoin';

interface UseSignPSBTReturnType {
  handleSignTransaction: (btcAmount: number, vaultUUID: string) => Promise<void>;
  fundingTransactionSigned: boolean;
  closingTransactionSigned: boolean;
}

export function useSignPSBT(useBitcoin?: UseBitcoinReturnType): UseSignPSBTReturnType {
  if (!useBitcoin) throw new Error('useBitcoin must be set before useSignPSBT can be used');

  const { signAndBroadcastFundingPSBT, signClosingPSBT } = useBitcoin;
  const { network } = useSelector((state: RootState) => state.account);
  const dispatch = useDispatch();
  const [btcAmount, setBTCAmount] = useState<number | undefined>();
  const [vaultUUID, setVaultUUID] = useState<string | undefined>();
  const [fundingTransactionSigned, setFundingTransactionSigned] = useState(false);
  const [closingTransactionSigned, setClosingTransactionSigned] = useState(false);
  const [fundingTransactionID, setFundingTransactionID] = useState<string | undefined>();
  const [multisigTransaction, setMultisigTransaction] = useState<btc.P2TROut | undefined>();
  const [userNativeSegwitAddress, setUserNativeSegwitAddress] = useState<string | undefined>();

  useEffect(() => {
    const signClosingTransaction = async () => {
      if (
        fundingTransactionSigned &&
        btcAmount &&
        vaultUUID &&
        network &&
        fundingTransactionID &&
        multisigTransaction &&
        userNativeSegwitAddress
      ) {
        await handleSignClosingTransaction();
        dispatch(
          vaultActions.setVaultToFunding({
            vaultUUID,
            fundingTX: fundingTransactionID,
            networkID: network.id,
          })
        );
        dispatch(mintUnmintActions.setMintStep([2, vaultUUID]));
      }
    };
    signClosingTransaction();
  }, [
    fundingTransactionSigned,
    btcAmount,
    fundingTransactionID,
    multisigTransaction,
    userNativeSegwitAddress,
    network,
    vaultUUID,
  ]);

  async function handleSignFundingTransaction(btcAmount: number): Promise<string> {
    try {
      const { fundingTransactionID, multisigTransaction, userNativeSegwitAddress } =
        await signAndBroadcastFundingPSBT(btcAmount);
      setBTCAmount(btcAmount);
      setFundingTransactionID(fundingTransactionID);
      setMultisigTransaction(multisigTransaction);
      setUserNativeSegwitAddress(userNativeSegwitAddress);
      setFundingTransactionSigned(true);
      return fundingTransactionID;
    } catch (error) {
      throw new BitcoinError(`Error signing funding transaction: ${error}`);
    }
  }

  async function handleSignClosingTransaction() {
    try {
      if (
        !fundingTransactionID ||
        !multisigTransaction ||
        !userNativeSegwitAddress ||
        !btcAmount ||
        !vaultUUID
      ) {
        throw new Error(
          'Funding transaction must be signed before closing transaction can be signed'
        );
      }
      await signClosingPSBT(
        fundingTransactionID,
        multisigTransaction,
        vaultUUID,
        userNativeSegwitAddress,
        btcAmount
      );
      setClosingTransactionSigned(true);
    } catch (error) {
      throw new BitcoinError(`Error signing closing transaction: ${error}`);
    }
  }

  async function handleSignTransaction(btcAmount: number, vaultUUID: string) {
    const shiftedBTCDepositAmount = customShiftValue(btcAmount, 8, false);
    setBTCAmount(shiftedBTCDepositAmount);
    setVaultUUID(vaultUUID);
    if (!fundingTransactionSigned) {
      await handleSignFundingTransaction(shiftedBTCDepositAmount);
    } else {
      await handleSignClosingTransaction();
      if (fundingTransactionID && network && vaultUUID) {
        dispatch(
          vaultActions.setVaultToFunding({
            vaultUUID,
            fundingTX: fundingTransactionID,
            networkID: network.id,
          })
        );
        dispatch(mintUnmintActions.setMintStep([2, vaultUUID]));
      }
    }
  }

  return { handleSignTransaction, fundingTransactionSigned, closingTransactionSigned };
}
