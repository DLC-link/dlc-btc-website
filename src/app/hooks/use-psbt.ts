import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BitcoinError } from '@models/error-types';
import { Vault } from '@models/vault';
import { BitcoinWalletType } from '@models/wallet';
import { BitcoinWalletContext } from '@providers/bitcoin-wallet-context-provider';
import { EthereumHandlerContext } from '@providers/ethereum-handler-context-provider';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { vaultActions } from '@store/slices/vault/vault.actions';
import { LedgerDLCHandler, SoftwareWalletDLCHandler } from 'dlc-btc-lib';
import { broadcastTransaction } from 'dlc-btc-lib/bitcoin-functions';
import { Transaction } from 'dlc-btc-lib/models';

import { useAttestors } from './use-attestors';
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
  const { bitcoinWalletType, dlcHandler, resetBitcoinWalletContext } =
    useContext(BitcoinWalletContext);
  const { sendClosingTransactionToAttestors } = useAttestors();
  const { readOnlyEthereumHandler } = useContext(EthereumHandlerContext);

  const { network } = useSelector((state: RootState) => state.account);

  const { mintStep } = useSelector((state: RootState) => state.mintunmint);

  const [fundingTransaction, setFundingTransaction] = useState<Transaction | undefined>();

  async function handleSignFundingTransaction(): Promise<void> {
    try {
      if (!readOnlyEthereumHandler) throw new BitcoinError('Ethereum Handler is not yet set.');

      const attestorGroupPublicKey = await readOnlyEthereumHandler.getAttestorGroupPublicKey();
      const vault = await readOnlyEthereumHandler.getRawVault(mintStep[1]);
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
      const vault = await readOnlyEthereumHandler?.getRawVault(mintStep[1]);
      if (!vault) throw new BitcoinError('Vault is not yet set.');
      const feeRateMultiplier = import.meta.env.VITE_FEE_RATE_MULTIPLIER;
      switch (bitcoinWalletType) {
        case 'Ledger':
          closingTransactionHex = await handleClosingTransactionWithLedger(
            dlcHandler as LedgerDLCHandler,
            vault,
            fundingTransaction.id,
            feeRateMultiplier
          );
          break;
        case 'Leather':
          closingTransactionHex = await handleClosingTransactionWithLeather(
            dlcHandler as SoftwareWalletDLCHandler,
            vault,
            fundingTransaction.id,
            feeRateMultiplier
          );
          break;
        default:
          throw new BitcoinError('Invalid Bitcoin Wallet Type');
      }

      const fundingAddress = dlcHandler?.getVaultRelatedAddress('funding');

      if (!fundingAddress) throw new BitcoinError('Funding Address is not defined');

      await sendClosingTransactionToAttestors(
        fundingTransaction?.hex,
        closingTransactionHex,
        mintStep[1],
        fundingAddress
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

  return {
    handleSignFundingTransaction,
    handleSignClosingTransaction,
    isLoading: bitcoinWalletType === BitcoinWalletType.Leather ? isLeatherLoading : isLedgerLoading,
  };
}
