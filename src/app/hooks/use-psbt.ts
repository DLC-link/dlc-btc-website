import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { broadcastTransaction } from '@functions/bitcoin-functions';
import { BitcoinError } from '@models/error-types';
import { Vault } from '@models/vault';
import { BitcoinWalletType } from '@models/wallet';
import { BitcoinWalletContext } from '@providers/bitcoin-wallet-context-provider';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { vaultActions } from '@store/slices/vault/vault.actions';
import { LedgerDLCHandler, SoftwareWalletDLCHandler } from 'dlc-btc-lib';
import { Transaction } from 'dlc-btc-lib/models';

import { useAttestors } from './use-attestors';
import { useEthereum } from './use-ethereum';
import { useLeather } from './use-leather';
import { useLedger } from './use-ledger';

interface UsePSBTReturnType {
  handleSignFundingTransaction: (vault: Vault) => Promise<void>;
  handleSignClosingTransaction: () => Promise<void>;
  handleSignWithdrawTransaction: (vaultUUID: string, withdrawAmount: number) => Promise<void>;
  isLoading: [boolean, string];
}

export function usePSBT(): UsePSBTReturnType {
  const dispatch = useDispatch();
  const {
    handleFundingTransaction: handleFundingTransactionWithLedger,
    handleClosingTransaction: handleClosingTransactionWithLedger,
    handleWithdrawalTransaction: handleWithdrawalTransactionWithLedger,
    isLoading: isLedgerLoading,
  } = useLedger();
  const {
    handleFundingTransaction: handleFundingTransactionWithLeather,
    handleClosingTransaction: handleClosingTransactionWithLeather,
    handleWithdrawalTransaction: handleWithdrawalTransactionWithLeather,
    isLoading: isLeatherLoading,
  } = useLeather();
  const { bitcoinWalletType, dlcHandler, resetBitcoinWalletContext } =
    useContext(BitcoinWalletContext);
  const { sendClosingTransactionToAttestors, sendWithdrawalTransactionToAttestors } =
    useAttestors();
  const { getAttestorGroupPublicKey, getRawVault } = useEthereum();

  const { network } = useSelector((state: RootState) => state.account);

  const { mintStep } = useSelector((state: RootState) => state.mintunmint);

  const [fundingTransaction, setFundingTransaction] = useState<Transaction | undefined>();

  async function handleSignFundingTransaction(): Promise<void> {
    try {
      const attestorGroupPublicKey = await getAttestorGroupPublicKey(network);
      const vault = await getRawVault(mintStep[1]);
      let fundingTransaction: Transaction;
      const feeRateMultiplier = import.meta.env.VITE_FEE_RATE_MULTIPLIER;

      switch (bitcoinWalletType) {
        case 'Ledger':
          fundingTransaction = await handleFundingTransactionWithLedger(
            dlcHandler as LedgerDLCHandler,
            vault,
            attestorGroupPublicKey,
            feeRateMultiplier
          );
          break;
        case 'Leather':
          fundingTransaction = await handleFundingTransactionWithLeather(
            dlcHandler as SoftwareWalletDLCHandler,
            vault,
            attestorGroupPublicKey,
            feeRateMultiplier
          );
          break;
        default:
          throw new BitcoinError('Invalid Bitcoin Wallet Type');
      }

      setFundingTransaction(fundingTransaction);
    } catch (error) {
      throw new BitcoinError(`Error signing Funding Transaction: ${error}`);
    }
  }

  async function handleSignClosingTransaction() {
    try {
      if (!fundingTransaction) throw new BitcoinError('Funding Transaction is not yet signed.');
      let closingTransactionHex: string;
      const vault = await getRawVault(mintStep[1]);
      let nativeSegwitAddress;
      const feeRateMultiplier = import.meta.env.VITE_FEE_RATE_MULTIPLIER;
      switch (bitcoinWalletType) {
        case 'Ledger':
          closingTransactionHex = await handleClosingTransactionWithLedger(
            dlcHandler as LedgerDLCHandler,
            vault,
            fundingTransaction.id,
            feeRateMultiplier
          );
          nativeSegwitAddress = dlcHandler?.getVaultRelatedAddress('p2wpkh');
          break;
        case 'Leather':
          closingTransactionHex = await handleClosingTransactionWithLeather(
            dlcHandler as SoftwareWalletDLCHandler,
            vault,
            fundingTransaction.id,
            feeRateMultiplier
          );
          nativeSegwitAddress = dlcHandler?.getVaultRelatedAddress('p2wpkh');
          break;
        default:
          throw new BitcoinError('Invalid Bitcoin Wallet Type');
      }

      if (!nativeSegwitAddress) throw new BitcoinError('Native Segwit Address is not defined');

      await sendClosingTransactionToAttestors(
        fundingTransaction?.hex,
        closingTransactionHex,
        mintStep[1],
        nativeSegwitAddress
      );

      await broadcastTransaction(fundingTransaction.hex, appConfiguration.bitcoinBlockchainURL);

      dispatch(
        vaultActions.setVaultToFunding({
          vaultUUID: mintStep[1],
          fundingTX: fundingTransaction.id,
          networkID: network.id,
        })
      );

      dispatch(mintUnmintActions.setMintStep([3, mintStep[1]]));
      resetBitcoinWalletContext();
    } catch (error) {
      throw new BitcoinError(`Error signing Closing Transaction: ${error}`);
    }
  }

  async function handleSignWithdrawTransaction(
    vaultUUID: string,
    withdrawAmount: number
  ): Promise<void> {
    try {
      let withdrawalTransactionHex: string;
      const attestorGroupPublicKey = await getAttestorGroupPublicKey(network);
      const vault = await getRawVault(vaultUUID);
      let nativeSegwitAddress;
      const feeRateMultiplier = import.meta.env.VITE_FEE_RATE_MULTIPLIER;
      switch (bitcoinWalletType) {
        case 'Ledger':
          withdrawalTransactionHex = await handleWithdrawalTransactionWithLedger(
            dlcHandler as LedgerDLCHandler,
            withdrawAmount,
            attestorGroupPublicKey,
            vault,
            feeRateMultiplier
          );
          nativeSegwitAddress = dlcHandler?.getVaultRelatedAddress('p2wpkh');
          break;
        case 'Leather':
          withdrawalTransactionHex = await handleWithdrawalTransactionWithLeather(
            dlcHandler as SoftwareWalletDLCHandler,
            withdrawAmount,
            attestorGroupPublicKey,
            vault,
            feeRateMultiplier
          );
          nativeSegwitAddress = dlcHandler?.getVaultRelatedAddress('p2wpkh');
          break;
        default:
          throw new BitcoinError('Invalid Bitcoin Wallet Type');
      }

      if (!nativeSegwitAddress) throw new BitcoinError('Native Segwit Address is not defined');

      await sendWithdrawalTransactionToAttestors(withdrawalTransactionHex, vaultUUID);

      // I don't think we want to do this because the attestors haven't signed it.
      // await broadcastTransaction(withdrawalTransactionHex, appConfiguration.bitcoinBlockchainURL);

      resetBitcoinWalletContext();
    } catch (error) {
      throw new BitcoinError(`Error signing Closing Transaction: ${error}`);
    }
  }

  return {
    handleSignFundingTransaction,
    handleSignClosingTransaction,
    handleSignWithdrawTransaction,
    isLoading: bitcoinWalletType === BitcoinWalletType.Leather ? isLeatherLoading : isLedgerLoading,
  };
}
