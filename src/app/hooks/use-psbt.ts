import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BitcoinError } from '@models/error-types';
import { Vault } from '@models/vault';
import * as btc from '@scure/btc-signer';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { vaultActions } from '@store/slices/vault/vault.actions';

import { useBitcoin } from './use-bitcoin';

interface UsePSBTReturnType {
  handleSignFundingTransaction: (vault: Vault) => Promise<void>;
  handleSignClosingTransaction: () => Promise<void>;
}

export function usePSBT(): UsePSBTReturnType {
  const dispatch = useDispatch();
  const { signAndBroadcastFundingPSBT, signAndSendClosingPSBT, broadcastTransaction } =
    useBitcoin();

  const { network } = useSelector((state: RootState) => state.account);

  const [vault, setVault] = useState<Vault | undefined>();

  const [userNativeSegwitAddress, setUserNativeSegwitAddress] = useState<string | undefined>();
  const [fundingTransaction, setFundingTransaction] = useState<btc.Transaction | undefined>();
  const [multisigTransaction, setMultisigTransaction] = useState<btc.P2TROut | undefined>();

  async function handleSignFundingTransaction(vault: Vault): Promise<void> {
    try {
      const { fundingTransaction, multisigTransaction, userNativeSegwitAddress } =
        await signAndBroadcastFundingPSBT(vault);

      setVault(vault);
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
        !vault ||
        !network
      ) {
        throw new BitcoinError(
          'Missing information for Closing Transaction, Funding Transaction must be signed before Closing Transaction can be signed'
        );
      }
      await broadcastTransaction(fundingTransaction);

      await signAndSendClosingPSBT(
        fundingTransaction.id,
        multisigTransaction,
        userNativeSegwitAddress,
        vault
      );

      dispatch(
        vaultActions.setVaultToFunding({
          vaultUUID: vault.uuid,
          fundingTX: fundingTransaction.id,
          networkID: network.id,
        })
      );

      dispatch(mintUnmintActions.setMintStep([3, vault.uuid]));
    } catch (error) {
      throw new BitcoinError(`Error signing Closing Transaction: ${error}`);
    }
  }

  return {
    handleSignFundingTransaction,
    handleSignClosingTransaction,
  };
}
