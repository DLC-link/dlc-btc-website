import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { customShiftValue } from '@common/utilities';
import { BitcoinError } from '@models/error-types';
import * as btc from '@scure/btc-signer';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { vaultActions } from '@store/slices/vault/vault.actions';

import { useBitcoin } from './use-bitcoin';

interface UsePSBTReturnType {
  handleSignFundingTransaction: (btcAmount: number, vaultUUID: string) => Promise<void>;
  handleSignClosingTransaction: () => Promise<void>;
}

export function usePSBT(): UsePSBTReturnType {
  const dispatch = useDispatch();
  const { signAndBroadcastFundingPSBT, signAndSendClosingPSBT, broadcastTransaction } =
    useBitcoin();

  const { network } = useSelector((state: RootState) => state.account);

  const [vaultUUID, setVaultUUID] = useState<string | undefined>();
  const [bitcoinAmount, setBitcoinAmount] = useState<number | undefined>();

  const [userNativeSegwitAddress, setUserNativeSegwitAddress] = useState<string | undefined>();
  const [fundingTransaction, setFundingTransaction] = useState<btc.Transaction | undefined>();
  const [multisigTransaction, setMultisigTransaction] = useState<btc.P2TROut | undefined>();

  async function handleSignFundingTransaction(
    bitcoinAmount: number,
    vaultUUID: string
  ): Promise<void> {
    const shiftedBTCDepositAmount = customShiftValue(bitcoinAmount, 8, false);

    try {
      const { fundingTransaction, multisigTransaction, userNativeSegwitAddress } =
        await signAndBroadcastFundingPSBT(shiftedBTCDepositAmount);

      setVaultUUID(vaultUUID);
      setBitcoinAmount(shiftedBTCDepositAmount);
      setUserNativeSegwitAddress(userNativeSegwitAddress);
      setFundingTransaction(fundingTransaction);
      setMultisigTransaction(multisigTransaction);
    } catch (error) {
      throw new BitcoinError(`Error signing Funding Transaction: ${error}`);
    }
  }

  async function handleSignClosingTransaction() {
    try {
      if (
        !fundingTransaction ||
        !multisigTransaction ||
        !userNativeSegwitAddress ||
        !bitcoinAmount ||
        !vaultUUID ||
        !network
      ) {
        throw new BitcoinError(
          'Missing information for Closing Transaction, Funding Transaction must be signed before Closing Transaction can be signed'
        );
      }

      await signAndSendClosingPSBT(
        fundingTransaction.id,
        multisigTransaction,
        vaultUUID,
        userNativeSegwitAddress,
        bitcoinAmount
      );

      await broadcastTransaction(fundingTransaction);

      dispatch(
        vaultActions.setVaultToFunding({
          vaultUUID,
          fundingTX: fundingTransaction.id,
          networkID: network.id,
        })
      );

      dispatch(mintUnmintActions.setMintStep([3, vaultUUID]));
    } catch (error) {
      throw new BitcoinError(`Error signing Closing Transaction: ${error}`);
    }
  }

  return {
    handleSignFundingTransaction,
    handleSignClosingTransaction,
  };
}
