import { useContext, useState } from 'react';

import { BitcoinError } from '@models/error-types';
import { BitcoinWalletType } from '@models/wallet';
import { bytesToHex } from '@noble/hashes/utils';
import { BitcoinWalletContext } from '@providers/bitcoin-wallet-context-provider';
import { LedgerDLCHandler, RippleHandler, SoftwareWalletDLCHandler } from 'dlc-btc-lib';
import {
  submitFundingPSBT,
  submitWithdrawDepositPSBT,
} from 'dlc-btc-lib/attestor-request-functions';
import { Transaction, VaultState } from 'dlc-btc-lib/models';
import { useAccount } from 'wagmi';

import { useLeather } from './use-leather';
import { useLedger } from './use-ledger';
import { useUnisat } from './use-unisat';

interface UsePSBTReturnType {
  handleSignFundingTransaction: (vaultUUID: string, depositAmount: number) => Promise<void>;
  handleSignWithdrawTransaction: (vaultUUID: string, withdrawAmount: number) => Promise<void>;
  bitcoinDepositAmount: number;
  isLoading: [boolean, string];
}

export function usePSBT(): UsePSBTReturnType {
  const { address: ethereumUserAddress } = useAccount();

  const { bitcoinWalletType, dlcHandler, resetBitcoinWalletContext } =
    useContext(BitcoinWalletContext);

  const {
    handleFundingTransaction: handleFundingTransactionWithLedger,
    handleWithdrawalTransaction: handleWithdrawalTransactionWithLedger,
    handleDepositTransaction: handleDepositTransactionWithLedger,
    isLoading: isLedgerLoading,
  } = useLedger();

  const {
    handleFundingTransaction: handleFundingTransactionWithLeather,
    handleWithdrawalTransaction: handleWithdrawalTransactionWithLeather,
    handleDepositTransaction: handleDepositTransactionWithLeather,
    isLoading: isLeatherLoading,
  } = useLeather();

  const {
    handleFundingTransaction: handleFundingTransactionWithUnisat,
    handleWithdrawalTransaction: handleWithdrawalTransactionWithUnisat,
    handleDepositTransaction: handleDepositTransactionWithUnisat,
    isLoading: isUnisatLoading,
  } = useUnisat();

  const [bitcoinDepositAmount, setBitcoinDepositAmount] = useState(0);

  async function handleSignFundingTransaction(
    vaultUUID: string,
    depositAmount: number
  ): Promise<void> {
    try {
      if (!dlcHandler) throw new Error('DLC Handler is not setup');
      if (!ethereumUserAddress) throw new Error('User Address is not setup');

      const feeRateMultiplier = import.meta.env.VITE_FEE_RATE_MULTIPLIER;

      const attestorGroupPublicKey =
        'tpubDD8dCy2CrA7VgZdyLLmJB75nxWaokiCSZsPpqkj1uWjbLtxzuBCZQBtBMHpq9GU16v5RrhRz9EfhyK8QyenS3EtL7DAeEi6EBXRiaM2Usdm';

      const rippleHandler = RippleHandler.fromSeed('sEdSKUhR1Hhwomo7CsUzAe2pv7nqUXT');
      const vault = await rippleHandler.getRawVault(vaultUUID);

      let fundingTransaction: Transaction;
      switch (bitcoinWalletType) {
        case 'Ledger':
          switch (vault.valueLocked.toNumber()) {
            case 0:
              fundingTransaction = await handleFundingTransactionWithLedger(
                dlcHandler as LedgerDLCHandler,
                vault,
                depositAmount,
                attestorGroupPublicKey,
                feeRateMultiplier
              );
              break;
            default:
              fundingTransaction = await handleDepositTransactionWithLedger(
                dlcHandler as LedgerDLCHandler,
                vault,
                depositAmount,
                attestorGroupPublicKey,
                feeRateMultiplier
              );
          }
          break;
        case 'Unisat':
          switch (vault.valueLocked.toNumber()) {
            case 0:
              fundingTransaction = await handleFundingTransactionWithUnisat(
                dlcHandler as SoftwareWalletDLCHandler,
                vault,
                depositAmount,
                attestorGroupPublicKey,
                feeRateMultiplier
              );
              break;
            default:
              fundingTransaction = await handleDepositTransactionWithUnisat(
                dlcHandler as SoftwareWalletDLCHandler,
                vault,
                depositAmount,
                attestorGroupPublicKey,
                feeRateMultiplier
              );
              break;
          }
          break;
        case 'Leather':
          switch (vault.valueLocked.toNumber()) {
            case 0:
              fundingTransaction = await handleFundingTransactionWithLeather(
                dlcHandler as SoftwareWalletDLCHandler,
                vault,
                depositAmount,
                attestorGroupPublicKey,
                feeRateMultiplier
              );
              break;
            default:
              fundingTransaction = await handleDepositTransactionWithLeather(
                dlcHandler as SoftwareWalletDLCHandler,
                vault,
                depositAmount,
                attestorGroupPublicKey,
                feeRateMultiplier
              );
              break;
          }
          break;
        default:
          throw new BitcoinError('Invalid Bitcoin Wallet Type');
      }

      switch (vault.status) {
        case VaultState.READY:
          await submitFundingPSBT([appConfiguration.coordinatorURL], {
            vaultUUID,
            fundingPSBT: bytesToHex(fundingTransaction.toPSBT()),
            userEthereumAddress: ethereumUserAddress,
            userBitcoinTaprootPublicKey: dlcHandler.getTaprootDerivedPublicKey(),
            attestorChainID: 'ripple-xrpl-testnet',
          });
          break;
        default:
          await submitWithdrawDepositPSBT([appConfiguration.coordinatorURL], {
            vaultUUID,
            withdrawDepositPSBT: bytesToHex(fundingTransaction.toPSBT()),
          });
      }

      setBitcoinDepositAmount(depositAmount);
      resetBitcoinWalletContext();
    } catch (error) {
      throw new BitcoinError(`Error signing Funding Transaction: ${error}`);
    }
  }

  async function handleSignWithdrawTransaction(
    vaultUUID: string,
    withdrawAmount: number
  ): Promise<void> {
    try {
      if (!dlcHandler) throw new Error('DLC Handler is not setup');
      if (!ethereumUserAddress) throw new Error('User Address is not setup');

      const feeRateMultiplier = import.meta.env.VITE_FEE_RATE_MULTIPLIER;

      const attestorGroupPublicKey =
        'tpubDD8dCy2CrA7VgZdyLLmJB75nxWaokiCSZsPpqkj1uWjbLtxzuBCZQBtBMHpq9GU16v5RrhRz9EfhyK8QyenS3EtL7DAeEi6EBXRiaM2Usdm';
      const rippleHandler = RippleHandler.fromSeed('sEdSKUhR1Hhwomo7CsUzAe2pv7nqUXT');
      const vault = await rippleHandler.getRawVault(vaultUUID);

      if (!bitcoinWalletType) throw new Error('Bitcoin Wallet is not setup');

      let withdrawalTransactionHex: string;
      switch (bitcoinWalletType) {
        case 'Ledger':
          withdrawalTransactionHex = await handleWithdrawalTransactionWithLedger(
            dlcHandler as LedgerDLCHandler,
            withdrawAmount,
            attestorGroupPublicKey,
            vault,
            feeRateMultiplier
          );
          break;
        case 'Unisat':
          withdrawalTransactionHex = await handleWithdrawalTransactionWithUnisat(
            dlcHandler as SoftwareWalletDLCHandler,
            withdrawAmount,
            attestorGroupPublicKey,
            vault,
            feeRateMultiplier
          );
          break;
        case 'Leather':
          withdrawalTransactionHex = await handleWithdrawalTransactionWithLeather(
            dlcHandler as SoftwareWalletDLCHandler,
            withdrawAmount,
            attestorGroupPublicKey,
            vault,
            feeRateMultiplier
          );
          break;
        default:
          throw new BitcoinError('Invalid Bitcoin Wallet Type');
      }

      await submitWithdrawDepositPSBT([appConfiguration.coordinatorURL], {
        vaultUUID,
        withdrawDepositPSBT: withdrawalTransactionHex,
      });

      resetBitcoinWalletContext();
    } catch (error) {
      throw new BitcoinError(`Error signing Withdraw Transaction: ${error}`);
    }
  }

  const loadingStates = {
    [BitcoinWalletType.Ledger]: isLedgerLoading,
    [BitcoinWalletType.Leather]: isLeatherLoading,
    [BitcoinWalletType.Unisat]: isUnisatLoading,
  };

  return {
    handleSignFundingTransaction,
    handleSignWithdrawTransaction,
    bitcoinDepositAmount,
    isLoading: bitcoinWalletType ? loadingStates[bitcoinWalletType] : [false, ''],
  };
}
