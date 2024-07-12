/** @format */
import { useContext, useState } from 'react';

import Transport from '@ledgerhq/hw-transport-webusb';
import { LedgerError } from '@models/error-types';
import { LEDGER_APPS_MAP } from '@models/ledger';
import { SupportedPaymentType } from '@models/supported-payment-types';
import { bytesToHex } from '@noble/hashes/utils';
import {
  BitcoinWalletContext,
  BitcoinWalletContextState,
} from '@providers/bitcoin-wallet-context-provider';
import { LedgerDLCHandler } from 'dlc-btc-lib';
import { getBalance } from 'dlc-btc-lib/bitcoin-functions';
import { bitcoin } from 'dlc-btc-lib/constants';
import { RawVault, Transaction } from 'dlc-btc-lib/models';
import { createRangeFromLength, delay, shiftValue, unshiftValue } from 'dlc-btc-lib/utilities';
import { AppClient, DefaultWalletPolicy } from 'ledger-bitcoin';

import { BITCOIN_NETWORK_MAP } from '@shared/constants/bitcoin.constants';

type TransportInstance = Awaited<ReturnType<typeof Transport.create>>;

interface UseLedgerReturnType {
  getLedgerAddressesWithBalances: (
    paymentType: SupportedPaymentType,
    accountIndex: number,
    startIndex: number
  ) => Promise<[string, number][]>;
  connectLedgerWallet: (
    walletAccountIndex: number,
    paymentType: SupportedPaymentType
  ) => Promise<void>;
  handleFundingTransaction: (
    dlcHandler: LedgerDLCHandler,
    vault: RawVault,
    bitcoinAmount: number,
    attestorGroupPublicKey: string,
    feeRateMultiplier: number
  ) => Promise<Transaction>;
  handleDepositTransaction: (
    dlcHandler: LedgerDLCHandler,
    vault: RawVault,
    withdrawAmount: number,
    attestorGroupPublicKey: string,
    feeRateMultiplier: number
  ) => Promise<Transaction>;
  handleWithdrawalTransaction: (
    dlcHandler: LedgerDLCHandler,
    withdrawAmount: number,
    attestorGroupPublicKey: string,
    vault: RawVault,
    feeRateMultiplier: number
  ) => Promise<string>;
  isLoading: [boolean, string];
}

export function useLedger(): UseLedgerReturnType {
  const { setBitcoinWalletContextState, setDLCHandler } = useContext(BitcoinWalletContext);

  const [ledgerApp, setLedgerApp] = useState<AppClient | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<[boolean, string]>([false, '']);

  /**
   * Gets the Ledger App.
   * @param appName The name of the Ledger App.
   * @returns The Ledger App.
   */
  async function getLedgerApp(appName: string): Promise<AppClient> {
    setIsLoading([true, `Opening Ledger ${appName} App`]);
    const transport = await Transport.create();
    const ledgerApp = new AppClient(transport);
    const appAndVersion = await ledgerApp.getAppAndVersion();

    if (appAndVersion.name === appName) {
      setIsLoading([false, '']);
      return new AppClient(transport);
    }

    if (appAndVersion.name === LEDGER_APPS_MAP.MAIN_MENU) {
      setIsLoading([true, `Open ${appName} App on your Ledger Device`]);
      await openApp(transport, appName);
      await delay(1500);
      setIsLoading([false, '']);
      return new AppClient(await Transport.create());
    }

    if (appAndVersion.name !== appName) {
      await quitApp(await Transport.create());
      await delay(1500);
      setIsLoading([true, `Open ${appName} App on your Ledger Device`]);
      await openApp(await Transport.create(), appName);
      await delay(1500);
      setIsLoading([false, '']);
      return new AppClient(await Transport.create());
    }

    throw new LedgerError(`Could not open Ledger ${appName} App`);
  }

  // Reference: https://github.com/LedgerHQ/ledger-live/blob/v22.0.1/src/hw/quitApp.ts\
  /**
   * Quits the Ledger App.
   * @param transport The Ledger Transport.
   * @returns A Promise that resolves when the Ledger App is quit.
   */
  async function quitApp(transport: TransportInstance): Promise<void> {
    await transport.send(0xb0, 0xa7, 0x00, 0x00);
  }

  // Reference: https://github.com/LedgerHQ/ledger-live/blob/v22.0.1/src/hw/openApp.ts
  /**
   * Opens the Ledger App.
   * @param transport The Ledger Transport.
   * @param name The name of the Ledger App.
   * @returns A Promise that resolves when the Ledger App is opened.
   */
  async function openApp(transport: TransportInstance, name: string): Promise<void> {
    await transport.send(0xe0, 0xd8, 0x00, 0x00, Buffer.from(name, 'ascii'));
  }

  /**
   * Gets the Ledger Addresses with Balances.
   * @param paymentType The Payment Type.
   * @returns The Ledger Addresses with Balances.
   */
  async function getLedgerAddressesWithBalances(
    paymentType: SupportedPaymentType,
    accountIndex: number,
    startIndex: number
  ): Promise<[string, number][]> {
    try {
      setIsLoading([true, 'Loading Ledger App and Information']);
      const ledgerApp = await getLedgerApp(
        BITCOIN_NETWORK_MAP[appConfiguration.bitcoinNetwork] === bitcoin
          ? LEDGER_APPS_MAP.BITCOIN_MAINNET
          : LEDGER_APPS_MAP.BITCOIN_TESTNET
      );
      setLedgerApp(ledgerApp);

      const masterFingerprint = await ledgerApp.getMasterFingerprint();
      const derivationPath = `${paymentType === 'wpkh' ? '84' : '86'}'/${BITCOIN_NETWORK_MAP[appConfiguration.bitcoinNetwork] === bitcoin ? 0 : 1}'/${accountIndex}'`;

      const indices = createRangeFromLength(startIndex + 5);
      const addresses = [];

      setIsLoading([
        true,
        `Loading ${paymentType === 'wpkh' ? 'Native Segwit' : 'Taproot'} Adresses`,
      ]);
      for (const index of indices) {
        const extendedPublicKey = await ledgerApp.getExtendedPubkey(`m/${derivationPath}`);

        const accountPolicy = new DefaultWalletPolicy(
          `${paymentType}(@0/**)`,
          `[${masterFingerprint}/${derivationPath}]${extendedPublicKey}`
        );

        const address = await ledgerApp.getWalletAddress(accountPolicy, null, 0, index, false);

        addresses.push(address);
      }

      const addressesWithBalances = await Promise.all(
        addresses.map(async address => {
          const balance = unshiftValue(
            await getBalance(address, appConfiguration.bitcoinBlockchainURL)
          );
          return [address, balance] as [string, number];
        })
      );

      setIsLoading([false, '']);
      return addressesWithBalances;
    } catch (error: any) {
      setIsLoading([false, '']);
      throw new LedgerError(`Error getting Ledger Addresses with Balances: ${error}`);
    }
  }

  async function connectLedgerWallet(
    walletAccountIndex: number,
    paymentType: SupportedPaymentType
  ): Promise<void> {
    try {
      setIsLoading([true, 'Connecting To Ledger Wallet']);
      if (!ledgerApp) {
        throw new LedgerError('Ledger App not initialized');
      }
      const masterFingerprint = await ledgerApp.getMasterFingerprint();

      const ledgerDLCHandler = new LedgerDLCHandler(
        ledgerApp,
        masterFingerprint,
        walletAccountIndex,
        paymentType,
        BITCOIN_NETWORK_MAP[appConfiguration.bitcoinNetwork],
        appConfiguration.bitcoinBlockchainURL,
        appConfiguration.bitcoinBlockchainFeeEstimateURL
      );

      setDLCHandler(ledgerDLCHandler);
      setBitcoinWalletContextState(BitcoinWalletContextState.READY);
      setIsLoading([false, '']);
    } catch (error: any) {
      setIsLoading([false, '']);
      throw new LedgerError(`Error connecting to Ledger Wallet: ${error}`);
    }
  }

  /**
   * Creates the Funding Transaction and signs it with the Ledger Device.
   * @param vaultUUID The Vault UUID.
   * @returns The Signed Funding Transaction.
   */
  async function handleFundingTransaction(
    dlcHandler: LedgerDLCHandler,
    vault: RawVault,
    bitcoinAmount: number,
    attestorGroupPublicKey: string,
    feeRateMultiplier: number
  ): Promise<Transaction> {
    try {
      setIsLoading([true, 'Accept Multisig Wallet Policy on your Ledger Device']);

      // ==> Create Funding Transaction
      const fundingPSBT = await dlcHandler.createFundingPSBT(
        vault,
        BigInt(shiftValue(bitcoinAmount)),
        attestorGroupPublicKey,
        feeRateMultiplier
      );

      setIsLoading([true, 'Sign Funding Transaction on your Ledger Device']);

      // ==> Sign Funding PSBT with Ledger
      const fundingTransaction = await dlcHandler.signPSBT(fundingPSBT, 'funding');

      setIsLoading([false, '']);
      return fundingTransaction;
    } catch (error) {
      setIsLoading([false, '']);
      throw new LedgerError(`Error handling Funding Transaction: ${error}`);
    }
  }

  async function handleDepositTransaction(
    dlcHandler: LedgerDLCHandler,
    vault: RawVault,
    withdrawAmount: number,
    attestorGroupPublicKey: string,
    feeRateMultiplier: number
  ): Promise<Transaction> {
    try {
      setIsLoading([true, 'Accept Multisig Wallet Policy on your Ledger Device']);

      const depositPSBT = await dlcHandler.createDepositPSBT(
        BigInt(shiftValue(withdrawAmount)),
        vault,
        attestorGroupPublicKey,
        vault.fundingTxId,
        feeRateMultiplier
      );

      setIsLoading([true, 'Sign Deposit Transaction in your Leather Wallet']);
      // ==> Sign Withdrawal PSBT with Ledger
      const depositTransaction = await dlcHandler.signPSBT(depositPSBT, 'deposit');

      setIsLoading([false, '']);
      return depositTransaction;
    } catch (error) {
      setIsLoading([false, '']);
      throw new LedgerError(`Error handling Deposit Transaction: ${error}`);
    }
  }

  async function handleWithdrawalTransaction(
    dlcHandler: LedgerDLCHandler,
    withdrawAmount: number,
    attestorGroupPublicKey: string,
    vault: RawVault,
    feeRateMultiplier: number
  ): Promise<string> {
    try {
      setIsLoading([true, 'Accept Multisig Wallet Policy on your Ledger Device']);

      const withdrawalPSBT = await dlcHandler.createWithdrawPSBT(
        vault,
        BigInt(shiftValue(withdrawAmount)),
        attestorGroupPublicKey,
        vault.fundingTxId,
        feeRateMultiplier
      );

      setIsLoading([true, 'Sign Withdrawal Transaction in your Leather Wallet']);
      // ==> Sign Withdrawal PSBT with Ledger
      const withdrawalTransaction = await dlcHandler.signPSBT(withdrawalPSBT, 'withdraw');

      setIsLoading([false, '']);
      return bytesToHex(withdrawalTransaction.toPSBT());
    } catch (error) {
      setIsLoading([false, '']);
      throw new LedgerError(`Error handling Withdrawal Transaction: ${error}`);
    }
  }

  return {
    getLedgerAddressesWithBalances,
    connectLedgerWallet,
    handleFundingTransaction,
    handleDepositTransaction,
    handleWithdrawalTransaction,
    isLoading,
  };
}
