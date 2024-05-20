import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { broadcastTransaction } from '@functions/bitcoin-functions';
import { BitcoinError } from '@models/error-types';
import { Vault } from '@models/vault';
import { BitcoinWalletType } from '@models/wallet';
import {
  BitcoinWalletContext,
  BitcoinWalletContextState,
} from '@providers/ledger-context-provider';
import * as btc from '@scure/btc-signer';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { vaultActions } from '@store/slices/vault/vault.actions';

import { useAttestors } from './use-attestors';
import { useEndpoints } from './use-endpoints';
import { useLeather } from './use-leather';
import { useLedger } from './use-ledger';

interface UsePSBTReturnType {
  handleSignFundingTransaction: (vault: Vault) => Promise<void>;
  handleSignClosingTransaction: () => Promise<void>;
  isLoading: [boolean, string];
}

export function usePSBT(): UsePSBTReturnType {
  const dispatch = useDispatch();
  const {
    handleFundingTransaction: handleFundingTransactionWithLedger,
    handleClosingTransaction: handleClosingTransactionWithLedger,
    isLoading: isLedgerLoading,
  } = useLedger();
  const {
    handleFundingTransaction: handleFundingTransactionWithLeather,
    handleClosingTransaction: handleClosingTransactionWithLeather,
    isLoading: isLeatherLoading,
  } = useLeather();
  const {
    bitcoinWalletType,
    nativeSegwitAddressInformation,
    setBitcoinWalletContextState,
    setNativeSegwitAddressInformation,
    setBitcoinWalletType,
    setTaprootMultisigAddressInformation,
  } = useContext(BitcoinWalletContext);
  const { bitcoinBlockchainAPIURL } = useEndpoints();
  const { sendClosingTransactionToAttestors } = useAttestors();

  const { network } = useSelector((state: RootState) => state.account);
  const { mintStep } = useSelector((state: RootState) => state.mintunmint);

  const [fundingTransaction, setFundingTransaction] = useState<btc.Transaction | undefined>();

  async function handleSignFundingTransaction(): Promise<void> {
    try {
      let handleFundingTransaction;
      switch (bitcoinWalletType) {
        case 'Ledger':
          handleFundingTransaction = handleFundingTransactionWithLedger;
          break;
        case 'Leather':
          handleFundingTransaction = handleFundingTransactionWithLeather;
          break;
        default:
          throw new BitcoinError('Invalid Bitcoin Wallet Type');
      }

      setFundingTransaction(await handleFundingTransaction(mintStep[1]));
    } catch (error) {
      throw new BitcoinError(`Error signing Funding Transaction: ${error}`);
    }
  }

  async function handleSignClosingTransaction() {
    try {
      if (!fundingTransaction) throw new BitcoinError('Funding Transaction is not yet signed.');
      let handleClosingTransaction;
      switch (bitcoinWalletType) {
        case 'Ledger':
          handleClosingTransaction = handleClosingTransactionWithLedger;
          break;
        case 'Leather':
          handleClosingTransaction = handleClosingTransactionWithLeather;
          break;
        default:
          throw new BitcoinError('Invalid Bitcoin Wallet Type');
      }

      const closingTransactionHex = await handleClosingTransaction(
        mintStep[1],
        fundingTransaction?.id
      );

      await sendClosingTransactionToAttestors(
        fundingTransaction?.hex,
        closingTransactionHex,
        mintStep[1],
        nativeSegwitAddressInformation?.nativeSegwitPayment.address!
      );

      await broadcastTransaction(fundingTransaction.hex, bitcoinBlockchainAPIURL);

      dispatch(
        vaultActions.setVaultToFunding({
          vaultUUID: mintStep[1],
          fundingTX: fundingTransaction.id,
          networkID: network.id,
        })
      );

      dispatch(mintUnmintActions.setMintStep([3, mintStep[1]]));
      setBitcoinWalletType(undefined);
      setBitcoinWalletContextState(BitcoinWalletContextState.INITIAL);
      setNativeSegwitAddressInformation(undefined);
      setTaprootMultisigAddressInformation(undefined);
    } catch (error) {
      throw new BitcoinError(`Error signing Closing Transaction: ${error}`);
    }
  }

  return {
    handleSignFundingTransaction,
    handleSignClosingTransaction,
    isLoading: bitcoinWalletType === BitcoinWalletType.Leather ? isLeatherLoading : isLedgerLoading,
  };
}
