import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BitcoinError } from '@models/error-types';
import { BitcoinWalletType } from '@models/wallet';
import { bytesToHex } from '@noble/hashes/utils';
import { BitcoinWalletContext } from '@providers/bitcoin-wallet-context-provider';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { vaultActions } from '@store/slices/vault/vault.actions';
import { LedgerDLCHandler, SoftwareWalletDLCHandler } from 'dlc-btc-lib';
import { Transaction, VaultState } from 'dlc-btc-lib/models';

import { useAttestors } from './use-attestors';
import { useEthereum } from './use-ethereum';
import { useEthereumConfiguration } from './use-ethereum-configuration';
import { useLeather } from './use-leather';
import { useLedger } from './use-ledger';

interface UsePSBTReturnType {
  handleSignFundingTransaction: (vaultUUID: string, depositAmount: number) => Promise<void>;
  handleSignWithdrawTransaction: (vaultUUID: string, withdrawAmount: number) => Promise<void>;
  bitcoinDepositAmount: number;
  isLoading: [boolean, string];
}

export function usePSBT(): UsePSBTReturnType {
  const dispatch = useDispatch();

  const { network: ethereumNetwork, address: ethereumUserAddress } = useSelector(
    (state: RootState) => state.account
  );

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

  const isLoadingMap = {
    [BitcoinWalletType.Leather]: isLeatherLoading,
    [BitcoinWalletType.Ledger]: isLedgerLoading,
  };

  const { sendFundingTransactionToAttestors, sendDepositWithdrawTransactionToAttestors } =
    useAttestors();

  const { getAttestorGroupPublicKey, getRawVault } = useEthereum();

  const { ethereumAttestorChainID } = useEthereumConfiguration();

  const [isLoading, setIsLoading] = useState<[boolean, string]>([false, '']);

  const [bitcoinDepositAmount, setBitcoinDepositAmount] = useState(0);

  async function handleSignFundingTransaction(
    vaultUUID: string,
    depositAmount: number
  ): Promise<void> {
    try {
      if (!dlcHandler) throw new Error('DLC Handler is not setup');
      if (!ethereumUserAddress) throw new Error('User Address is not setup');

      const feeRateMultiplier = import.meta.env.VITE_FEE_RATE_MULTIPLIER;

      const attestorGroupPublicKey = await getAttestorGroupPublicKey();
      const vault = await getRawVault(vaultUUID);

      if (!bitcoinWalletType) throw new Error('Bitcoin Wallet is not setup');

      setIsLoading(isLoadingMap[bitcoinWalletType]);

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
          await sendFundingTransactionToAttestors({
            vaultUUID,
            fundingPSBT: fundingTransaction.hex,
            userEthereumAddress: ethereumUserAddress,
            userBitcoinPublicKey: dlcHandler.getTaprootDerivedPublicKey(),
            chain: ethereumAttestorChainID,
          });

          dispatch(
            vaultActions.setVaultToFunding({
              vaultUUID: vaultUUID,
              fundingTX: fundingTransaction.id,
              networkID: ethereumNetwork.id,
            })
          );

          dispatch(mintUnmintActions.setMintStep([2, vaultUUID]));
          break;
        default:
          await sendDepositWithdrawTransactionToAttestors({
            vaultUUID,
            depositWithdrawPSBT: bytesToHex(fundingTransaction.toPSBT()),
            chain: ethereumAttestorChainID,
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

      const attestorGroupPublicKey = await getAttestorGroupPublicKey();
      const vault = await getRawVault(vaultUUID);

      if (!bitcoinWalletType) throw new Error('Bitcoin Wallet is not setup');

      setIsLoading(isLoadingMap[bitcoinWalletType]);

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

      await sendDepositWithdrawTransactionToAttestors({
        vaultUUID,
        depositWithdrawPSBT: withdrawalTransactionHex,
        chain: ethereumAttestorChainID,
      });

      resetBitcoinWalletContext();
    } catch (error) {
      throw new BitcoinError(`Error signing Withdraw Transaction: ${error}`);
    }
  }

  return {
    handleSignFundingTransaction,
    handleSignWithdrawTransaction,
    bitcoinDepositAmount,
    isLoading,
  };
}
