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
import { getBalance, getBitcoinAddressFromExtendedPublicKey } from 'dlc-btc-lib/bitcoin-functions';
import { Network, RawVault, Transaction } from 'dlc-btc-lib/models';
import { delay, shiftValue, unshiftValue } from 'dlc-btc-lib/utilities';
import { AppClient } from 'ledger-bitcoin';
import { range } from 'ramda';

import { BITCOIN_NETWORK_MAP } from '@shared/constants/bitcoin.constants';

type TransportInstance = Awaited<ReturnType<typeof Transport.create>>;

export interface BitcoinAddressInformation {
  index: number;
  address: string;
  balance: number;
}

interface UseLedgerReturnType {
  getAllLedgerAddressesWithBalances: (
    accountIndex: number,
    startIndex: number
  ) => Promise<{
    nativeSegwitAddresses: BitcoinAddressInformation[];
    taprootAddresses: BitcoinAddressInformation[];
  }>;
  connectLedgerWallet: (
    walletAccountIndex: number,
    walletAddressIndex: number,
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

  async function getAllLedgerAddressesWithBalances(
    walletAccountIndex: number,
    displayedAddressesStartIndex: number
  ): Promise<{
    nativeSegwitAddresses: BitcoinAddressInformation[];
    taprootAddresses: BitcoinAddressInformation[];
  }> {
    try {
      setIsLoading([true, 'Loading Ledger App and Information']);
      const bitcoinNetwork = BITCOIN_NETWORK_MAP[appConfiguration.bitcoinNetwork];
      const ledgerApp = await getLedgerApp(appConfiguration.ledgerApp);
      setLedgerApp(ledgerApp);

      setIsLoading([true, `Loading Bitcoin Addresses`]);
      const nativeSegwitAddresses = await getLedgerAddressesWithBalances(
        ledgerApp,
        bitcoinNetwork,
        SupportedPaymentType.NATIVE_SEGWIT,
        walletAccountIndex,
        displayedAddressesStartIndex
      );
      const taprootAddresses = await getLedgerAddressesWithBalances(
        ledgerApp,
        bitcoinNetwork,
        SupportedPaymentType.TAPROOT,
        walletAccountIndex,
        displayedAddressesStartIndex
      );
      setIsLoading([false, '']);
      return { nativeSegwitAddresses, taprootAddresses };
    } catch (error: any) {
      setIsLoading([false, '']);
      throw new LedgerError(`Error getting all Ledger Addresses with Balances: ${error}`);
    }
  }

  /**
   * Gets the Ledger Addresses with Balances.
   * @param paymentType The Payment Type.
   * @returns The Ledger Addresses with Balances.
   */
  async function getLedgerAddressesWithBalances(
    ledgerApp: AppClient,
    bitcoinNetwork: Network,
    paymentType: SupportedPaymentType,
    accountIndex: number,
    startIndex: number
  ): Promise<BitcoinAddressInformation[]> {
    try {
      const derivationPath = `${paymentType === 'wpkh' ? '84' : '86'}'/${appConfiguration.bitcoinNetworkIndex}'/${accountIndex}'`;
      const extendedPublicKey = await ledgerApp.getExtendedPubkey(`m/${derivationPath}`);

      const addresses: BitcoinAddressInformation[] = [];
      for (const i of range(startIndex, startIndex + 5)) {
        const address = getBitcoinAddressFromExtendedPublicKey(
          extendedPublicKey,
          bitcoinNetwork,
          i,
          paymentType
        );

        addresses.push({
          index: i,
          address: address,
          balance: 0,
        });
      }

      const addressesWithBalances: BitcoinAddressInformation[] = await Promise.all(
        addresses.map(async addressInformation => {
          const balance = unshiftValue(
            await getBalance(addressInformation.address, appConfiguration.bitcoinBlockchainURL)
          );
          addressInformation.balance = balance;

          return addressInformation;
        })
      );

      return addressesWithBalances;
    } catch (error: any) {
      setIsLoading([false, '']);
      throw new LedgerError(`Error getting Ledger Addresses with Balances: ${error}`);
    }
  }

  async function connectLedgerWallet(
    walletAccountIndex: number,
    walletAddressIndex: number,
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
        walletAddressIndex,
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
    getAllLedgerAddressesWithBalances,
    connectLedgerWallet,
    handleFundingTransaction,
    handleDepositTransaction,
    handleWithdrawalTransaction,
    isLoading,
  };
}
