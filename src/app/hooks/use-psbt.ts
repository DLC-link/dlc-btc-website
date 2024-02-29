import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { customShiftValue } from '@common/utilities';
import { BitcoinError } from '@models/error-types';
import * as btc from '@scure/btc-signer';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { vaultActions } from '@store/slices/vault/vault.actions';

import { UseBitcoinReturnType } from './use-bitcoin';

export interface UseSignPSBTReturnType {
  handleSignFundingTransaction: (btcAmount: number, vaultUUID: string) => Promise<string>;
  handleSignClosingTransaction: () => Promise<void>;
}

export function usePSBT(bitcoinHandler: UseBitcoinReturnType): UseSignPSBTReturnType {
  const dispatch = useDispatch();
  const { network } = useSelector((state: RootState) => state.account);

  const { signAndBroadcastFundingPSBT, signClosingPSBT } = bitcoinHandler;

  const [vaultUUID, setVaultUUID] = useState<string | undefined>();
  const [bitcoinAmount, setBitcoinAmount] = useState<number | undefined>();

  const [userNativeSegwitAddress, setUserNativeSegwitAddress] = useState<string | undefined>();
  const [fundingTransactionID, setFundingTransactionID] = useState<string | undefined>();
  const [multisigTransaction, setMultisigTransaction] = useState<btc.P2TROut | undefined>();

  async function handleSignFundingTransaction(
    bitcoinAmount: number,
    vaultUUID: string
  ): Promise<string> {
    const shiftedBTCDepositAmount = customShiftValue(bitcoinAmount, 8, false);

    try {
      const { fundingTransactionID, multisigTransaction, userNativeSegwitAddress } =
        await signAndBroadcastFundingPSBT(shiftedBTCDepositAmount);

      setVaultUUID(vaultUUID);
      setBitcoinAmount(shiftedBTCDepositAmount);
      setUserNativeSegwitAddress(userNativeSegwitAddress);
      setFundingTransactionID(fundingTransactionID);
      setMultisigTransaction(multisigTransaction);

      dispatch(mintUnmintActions.setMintStep([2, vaultUUID]));
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
        !bitcoinAmount ||
        !vaultUUID ||
        !network
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
        bitcoinAmount
      );
      dispatch(
        vaultActions.setVaultToFunding({
          vaultUUID,
          fundingTX: fundingTransactionID,
          networkID: network.id,
        })
      );
      dispatch(mintUnmintActions.setMintStep([3, vaultUUID]));
    } catch (error) {
      throw new BitcoinError(`Error signing closing transaction: ${error}`);
    }
  }

  return {
    handleSignFundingTransaction,
    handleSignClosingTransaction,
  };
}
