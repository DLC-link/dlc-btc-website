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
import { Transaction } from 'dlc-btc-lib/models';

import { FundingTXAttestorInfo, WithdrawalTXAttestorInfo, useAttestors } from './use-attestors';
import { useEthereum } from './use-ethereum';
import { useEthereumConfiguration } from './use-ethereum-configuration';
import { useLeather } from './use-leather';
import { useLedger } from './use-ledger';

interface UsePSBTReturnType {
  handleSignFundingTransaction: (vaultUUID: string, depositAmount: number) => Promise<void>;
  handleSignWithdrawTransaction: (vaultUUID: string, withdrawAmount: number) => Promise<void>;
  isLoading: [boolean, string];
}

export function usePSBT(): UsePSBTReturnType {
  const dispatch = useDispatch();

  const { network, address } = useSelector((state: RootState) => state.account);
  const { mintStep } = useSelector((state: RootState) => state.mintunmint);

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

  const {
    sendFundingTransactionToAttestors,
    sendWithdrawalTransactionToAttestors,
    sendDepositTransactionToAttestors,
  } = useAttestors();

  const { getAttestorGroupPublicKey, getRawVault } = useEthereum();

  const { ethereumAttestorChainID } = useEthereumConfiguration();

  const [isLoading, setIsLoading] = useState<[boolean, string]>([false, '']);

  async function handleSignFundingTransaction(
    vaultUUID: string,
    depositAmount: number
  ): Promise<void> {
    try {
      const feeRateMultiplier = import.meta.env.VITE_FEE_RATE_MULTIPLIER;

      const attestorGroupPublicKey = await getAttestorGroupPublicKey(network);
      const vault = await getRawVault(vaultUUID);

      if (!bitcoinWalletType) throw new Error('Bitcoin Wallet is not setup');

      setIsLoading(isLoadingMap[bitcoinWalletType]);

      let fundingTransaction: Transaction;
      switch (bitcoinWalletType) {
        case 'Ledger':
          if (vault.valueLocked.toNumber() === 0) {
            fundingTransaction = await handleFundingTransactionWithLedger(
              dlcHandler as LedgerDLCHandler,
              vault,
              depositAmount,
              attestorGroupPublicKey,
              feeRateMultiplier
            );
          } else {
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
          if (vault.valueLocked.toNumber() === 0) {
            fundingTransaction = await handleFundingTransactionWithLeather(
              dlcHandler as SoftwareWalletDLCHandler,
              vault,
              depositAmount,
              attestorGroupPublicKey,
              feeRateMultiplier
            );
          } else {
            fundingTransaction = await handleDepositTransactionWithLeather(
              dlcHandler as SoftwareWalletDLCHandler,
              vault,
              depositAmount,
              attestorGroupPublicKey,
              feeRateMultiplier
            );
          }
          break;
        default:
          throw new BitcoinError('Invalid Bitcoin Wallet Type');
      }

      const userTaprootPublicKey = dlcHandler?.getTaprootDerivedPublicKey();

      if (!address || !userTaprootPublicKey)
        throw new Error('Required Information is not available');

      if (vault.valueLocked.toNumber() === 0) {
        const fundingTXAttestorInfo: FundingTXAttestorInfo = {
          vaultUUID,
          fundingPSBT: fundingTransaction.hex,
          userEthereumAddress: address,
          userBitcoinPublicKey: userTaprootPublicKey,
          chain: ethereumAttestorChainID,
        };

        await sendFundingTransactionToAttestors(fundingTXAttestorInfo);

        dispatch(
          vaultActions.setVaultToFunding({
            vaultUUID: mintStep[1],
            fundingTX: fundingTransaction.id,
            networkID: network.id,
          })
        );

        dispatch(mintUnmintActions.setMintStep([2, mintStep[1]]));
      } else {
        const withdrawalTXAttestorInfo: WithdrawalTXAttestorInfo = {
          vaultUUID,
          withdrawalPSBT: bytesToHex(fundingTransaction.toPSBT()),
          chain: ethereumAttestorChainID,
        };
        await sendDepositTransactionToAttestors(withdrawalTXAttestorInfo);
      }

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
      const feeRateMultiplier = import.meta.env.VITE_FEE_RATE_MULTIPLIER;

      const attestorGroupPublicKey = await getAttestorGroupPublicKey(network);
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

      const withdrawalTXAttestorInfo: WithdrawalTXAttestorInfo = {
        vaultUUID,
        withdrawalPSBT: withdrawalTransactionHex,
        chain: ethereumAttestorChainID,
      };

      await sendWithdrawalTransactionToAttestors(withdrawalTXAttestorInfo);

      resetBitcoinWalletContext();
    } catch (error) {
      throw new BitcoinError(`Error signing Closing Transaction: ${error}`);
    }
  }

  return {
    handleSignFundingTransaction,
    handleSignWithdrawTransaction,
    isLoading,
  };
}
