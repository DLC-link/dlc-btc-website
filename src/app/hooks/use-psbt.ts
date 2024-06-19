import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BitcoinError } from '@models/error-types';
import { Vault } from '@models/vault';
import { BitcoinWalletType } from '@models/wallet';
import { BitcoinWalletContext } from '@providers/bitcoin-wallet-context-provider';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { vaultActions } from '@store/slices/vault/vault.actions';
import { LedgerDLCHandler, SoftwareWalletDLCHandler } from 'dlc-btc-lib';
import { broadcastTransaction } from 'dlc-btc-lib/bitcoin-functions';
import { Transaction } from 'dlc-btc-lib/models';

import { useAttestors } from './use-attestors';
import { useEthereum } from './use-ethereum';
import { useLeather } from './use-leather';
import { useLedger } from './use-ledger';

interface UsePSBTReturnType {
  handleSignFundingTransaction: (bitcoinAmount: number) => Promise<void>;
  handleSignWithdrawTransaction: (vaultUUID: string, withdrawAmount: number) => Promise<void>;
  isLoading: [boolean, string];
}

export function usePSBT(): UsePSBTReturnType {
  const dispatch = useDispatch();
  const {
    handleFundingTransaction: handleFundingTransactionWithLedger,
    handleWithdrawalTransaction: handleWithdrawalTransactionWithLedger,
    isLoading: isLedgerLoading,
  } = useLedger();
  const {
    handleFundingTransaction: handleFundingTransactionWithLeather,
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

  async function handleSignFundingTransaction(bitcoinAmount: number): Promise<void> {
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
            bitcoinAmount,
            attestorGroupPublicKey,
            feeRateMultiplier
          );
          break;
        case 'Leather':
          fundingTransaction = await handleFundingTransactionWithLeather(
            dlcHandler as SoftwareWalletDLCHandler,
            vault,
            bitcoinAmount,
            attestorGroupPublicKey,
            feeRateMultiplier
          );
          break;
        default:
          throw new BitcoinError('Invalid Bitcoin Wallet Type');
      }

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

      dispatch(mintUnmintActions.setMintStep([2, mintStep[1]]));
    } catch (error) {
      throw new BitcoinError(`Error signing Funding Transaction: ${error}`);
    }
  }

  async function handleSignWithdrawTransaction(
    vaultUUID: string,
    withdrawAmount: number
  ): Promise<void> {
    console.log('withdrawAmount', withdrawAmount);
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

      resetBitcoinWalletContext();
    } catch (error) {
      throw new BitcoinError(`Error signing Closing Transaction: ${error}`);
    }
  }

  return {
    handleSignFundingTransaction,
    handleSignWithdrawTransaction,
    isLoading: bitcoinWalletType === BitcoinWalletType.Leather ? isLeatherLoading : isLedgerLoading,
  };
}
