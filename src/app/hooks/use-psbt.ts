import { useContext, useState } from 'react';

import { BitcoinError } from '@models/error-types';
import { BitcoinWalletType } from '@models/wallet';
import { bytesToHex } from '@noble/hashes/utils';
import { BitcoinWalletContext } from '@providers/bitcoin-wallet-context-provider';
import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import {
  submitFundingPSBT,
  submitWithdrawDepositPSBT,
} from 'dlc-btc-lib/attestor-request-functions';
import { getAttestorGroupPublicKey, getRawVault } from 'dlc-btc-lib/ethereum-functions';
import { AttestorChainID, Transaction, VaultState } from 'dlc-btc-lib/models';
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

  const { ethereumNetworkConfiguration } = useContext(EthereumNetworkConfigurationContext);

  const [bitcoinDepositAmount, setBitcoinDepositAmount] = useState(0);

  const handleFundingTransactionMap = {
    [BitcoinWalletType.Ledger]: handleFundingTransactionWithLedger,
    [BitcoinWalletType.Leather]: handleFundingTransactionWithLeather,
    [BitcoinWalletType.Unisat]: handleFundingTransactionWithUnisat,
  };

  const handleDepositTransactionMap = {
    [BitcoinWalletType.Ledger]: handleDepositTransactionWithLedger,
    [BitcoinWalletType.Leather]: handleDepositTransactionWithLeather,
    [BitcoinWalletType.Unisat]: handleDepositTransactionWithUnisat,
  };

  const handleWithdrawalTransactionMap = {
    [BitcoinWalletType.Ledger]: handleWithdrawalTransactionWithLedger,
    [BitcoinWalletType.Leather]: handleWithdrawalTransactionWithLeather,
    [BitcoinWalletType.Unisat]: handleWithdrawalTransactionWithUnisat,
  };

  const loadingStateMap = {
    [BitcoinWalletType.Ledger]: isLedgerLoading,
    [BitcoinWalletType.Leather]: isLeatherLoading,
    [BitcoinWalletType.Unisat]: isUnisatLoading,
  };

  async function handleSignFundingTransaction(
    vaultUUID: string,
    depositAmount: number
  ): Promise<void> {
    try {
      if (!dlcHandler) throw new Error('DLC Handler is not setup');
      if (!ethereumUserAddress) throw new Error('User Address is not setup');
      if (!bitcoinWalletType) throw new Error('Bitcoin Wallet is not setup');

      const feeRateMultiplier = import.meta.env.VITE_FEE_RATE_MULTIPLIER;

      const dlcManagerContract = ethereumNetworkConfiguration.dlcManagerContract;

      const attestorGroupPublicKey = await getAttestorGroupPublicKey(dlcManagerContract);
      const vault = await getRawVault(dlcManagerContract, vaultUUID);
      const isFundingTransaction = vault.valueLocked.toNumber() === 0;

      const fundingTransaction: Transaction = isFundingTransaction
        ? await handleFundingTransactionMap[bitcoinWalletType](
            vault,
            depositAmount,
            attestorGroupPublicKey,
            feeRateMultiplier
          )
        : await handleDepositTransactionMap[bitcoinWalletType](
            vault,
            depositAmount,
            attestorGroupPublicKey,
            feeRateMultiplier
          );

      vault.status === VaultState.READY
        ? await submitFundingPSBT([appConfiguration.coordinatorURL], {
            vaultUUID,
            fundingPSBT: bytesToHex(fundingTransaction.toPSBT()),
            userEthereumAddress: ethereumUserAddress,
            userBitcoinTaprootPublicKey: dlcHandler.getTaprootDerivedPublicKey(),
            attestorChainID:
              ethereumNetworkConfiguration.ethereumAttestorChainID as AttestorChainID,
          })
        : await submitWithdrawDepositPSBT([appConfiguration.coordinatorURL], {
            vaultUUID,
            withdrawDepositPSBT: bytesToHex(fundingTransaction.toPSBT()),
          });

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
      if (!bitcoinWalletType) throw new Error('Bitcoin Wallet is not setup');

      const feeRateMultiplier = import.meta.env.VITE_FEE_RATE_MULTIPLIER;

      const dlcManagerContract = ethereumNetworkConfiguration.dlcManagerContract;

      const attestorGroupPublicKey = await getAttestorGroupPublicKey(dlcManagerContract);
      const vault = await getRawVault(dlcManagerContract, vaultUUID);

      const withdrawalTransactionHex = await handleWithdrawalTransactionMap[bitcoinWalletType](
        withdrawAmount,
        attestorGroupPublicKey,
        vault,
        feeRateMultiplier
      );

      await submitWithdrawDepositPSBT([appConfiguration.coordinatorURL], {
        vaultUUID,
        withdrawDepositPSBT: withdrawalTransactionHex,
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
    isLoading: bitcoinWalletType ? loadingStateMap[bitcoinWalletType] : [false, ''],
  };
}
