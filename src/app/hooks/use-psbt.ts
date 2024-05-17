import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { broadcastTransaction } from '@functions/bitcoin-functions';
import { BitcoinError } from '@models/error-types';
import { Vault } from '@models/vault';
import { BitcoinWalletContext } from '@providers/ledger-context-provider';
import * as btc from '@scure/btc-signer';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { vaultActions } from '@store/slices/vault/vault.actions';

import { useAttestors } from './use-attestors';
import { useBitcoin } from './use-bitcoin';
import { useEndpoints } from './use-endpoints';
import { useLedger } from './use-ledger';

interface UsePSBTReturnType {
  handleSignFundingTransaction: (vault: Vault) => Promise<void>;
  handleSignClosingTransaction: () => Promise<void>;
  isLedgerLoading: [boolean, string];
}

export function usePSBT(): UsePSBTReturnType {
  const dispatch = useDispatch();
  // const { signAndBroadcastFundingPSBT, signAndSendClosingPSBT, broadcastTransaction } =
  //   useBitcoin();
  const {
    handleFundingTransaction,
    handleClosingTransaction,
    isLoading: isLedgerLoading,
  } = useLedger();
  const { bitcoinWalletType, nativeSegwitAddressInformation } = useContext(BitcoinWalletContext);

  const { network } = useSelector((state: RootState) => state.account);

  const [vault, setVault] = useState<Vault | undefined>();
  const { bitcoinBlockchainAPIURL } = useEndpoints();

  const [userNativeSegwitAddress, setUserNativeSegwitAddress] = useState<string | undefined>();
  const [fundingTransaction, setFundingTransaction] = useState<btc.Transaction | undefined>();
  const [multisigTransaction, setMultisigTransaction] = useState<btc.P2TROut | undefined>();
  const { sendClosingTransactionToAttestors } = useAttestors();

  async function handleSignFundingTransaction(vault: Vault): Promise<void> {
    try {
      switch (bitcoinWalletType) {
        case 'Ledger':
          setVault(vault);
          setFundingTransaction(await handleFundingTransaction(vault.uuid));
          break;
      }
    } catch (error) {
      throw new BitcoinError(`Error signing Funding Transaction: ${error}`);
    }
  }

  async function handleSignClosingTransaction() {
    try {
      if (!vault || !network || !fundingTransaction) {
        throw new BitcoinError(
          'Missing information for Closing Transaction, Funding Transaction must be signed before Closing Transaction can be signed'
        );
      }

      switch (bitcoinWalletType) {
        case 'Ledger':
          await sendClosingTransactionToAttestors(
            fundingTransaction.hex,
            await handleClosingTransaction(vault.uuid, fundingTransaction?.id),
            vault.uuid,
            nativeSegwitAddressInformation?.nativeSegwitPayment.address!
          );
          await broadcastTransaction(fundingTransaction.hex, bitcoinBlockchainAPIURL);
          break;
      }

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
    isLedgerLoading,
  };
}
