/** @format */
import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';

import { delay, easyTruncateAddress } from '@common/utilities';
import {
  createBitcoinInputSigningConfiguration,
  createTaprootMultisigPayment,
  getBalance,
  getDerivedPublicKey,
  getFeeRate,
  getInputByPaymentTypeArray,
  getUnspendableKeyCommittedToUUID,
} from '@functions/bitcoin-functions';
import {
  addNativeSegwitSignaturesToPSBT,
  addTaprootInputSignaturesToPSBT,
  createClosingTransaction,
  createFundingTransaction,
  getNativeSegwitInputsToSign,
  getTaprootInputsToSign,
  updateNativeSegwitInputs,
  updateTaprootInputs,
} from '@functions/psbt-functions';
import Transport from '@ledgerhq/hw-transport-webusb';
import { LedgerError } from '@models/error-types';
import { LEDGER_APPS_MAP } from '@models/ledger';
import { RawVault } from '@models/vault';
import {
  BitcoinWalletContext,
  BitcoinWalletContextState,
} from '@providers/bitcoin-wallet-context-provider';
import { Transaction, p2wpkh } from '@scure/btc-signer';
import { RootState } from '@store/index';
import { Psbt } from 'bitcoinjs-lib';
import { bitcoin, testnet } from 'bitcoinjs-lib/src/networks';
import { AppClient, DefaultWalletPolicy, WalletPolicy } from 'ledger-bitcoin';

import {
  NATIVE_SEGWIT_DERIVATION_PATH,
  TAPROOT_DERIVATION_PATH,
} from '@shared/constants/bitcoin-constants';

import { useEndpoints } from './use-endpoints';
import { useEthereum } from './use-ethereum';

type TransportInstance = Awaited<ReturnType<typeof Transport.create>>;

interface LedgerBitcoinNetworkInformation {
  ledgerAppName: string;
  rootNativeSegwitDerivationPath: string;
  rootTaprootDerivationPath: string;
}

interface LedgerInformation {
  ledgerApp: AppClient;
  masterFingerprint: string;
  rootNativeSegwitDerivationPath: string;
  rootTaprootDerivationPath: string;
}

interface UseLedgerReturnType {
  getLedgerAddressesWithBalances: (paymentType: 'wpkh' | 'tr') => Promise<[string, number][]>;
  getNativeSegwitAccount: (nativeSegwitAddressIndex: number) => Promise<void>;
  getTaprootMultisigAccount: (vaultUUID: string) => Promise<void>;
  isLoading: [boolean, string];
  handleFundingTransaction: (vaultUUID: string) => Promise<Transaction>;
  handleClosingTransaction: (vaultUUID: string, fundingTransactionID: string) => Promise<string>;
}

export function useLedger(): UseLedgerReturnType {
  const {
    taprootMultisigAddressInformation,
    setTaprootMultisigAddressInformation,
    nativeSegwitAddressInformation,
    setNativeSegwitAddressInformation,
    setBitcoinWalletContextState,
  } = useContext(BitcoinWalletContext);
  const { bitcoinNetwork, bitcoinBlockchainAPIURL, bitcoinBlockchainAPIFeeURL } = useEndpoints();
  const { getAttestorGroupPublicKey } = useEthereum();
  const { getRawVault } = useEthereum();

  const { network } = useSelector((state: RootState) => state.account);

  const [ledgerInformation, setLedgerInformation] = useState<LedgerInformation | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState<[boolean, string]>([false, '']);

  /**
   * Gets the Bitcoin Network information for the Ledger.
   * @returns The Bitcoin Network information for the Ledger.
   */
  function getLedgerBitcoinNetworkInformation(): LedgerBitcoinNetworkInformation {
    switch (bitcoinNetwork) {
      case bitcoin:
        return {
          ledgerAppName: LEDGER_APPS_MAP.BITCOIN_MAINNET,
          rootNativeSegwitDerivationPath: `${NATIVE_SEGWIT_DERIVATION_PATH}/0'`,
          rootTaprootDerivationPath: `${TAPROOT_DERIVATION_PATH}/0'`,
        };
      case testnet:
        return {
          ledgerAppName: LEDGER_APPS_MAP.BITCOIN_TESTNET,
          rootNativeSegwitDerivationPath: `${NATIVE_SEGWIT_DERIVATION_PATH}/1'`,
          rootTaprootDerivationPath: `${TAPROOT_DERIVATION_PATH}/1'`,
        };
      default:
        throw new LedgerError(`Unsupported Bitcoin Network: ${bitcoinNetwork}`);
    }
  }

  /**
   * Gets the Ledger App and related information.
   * @returns The Ledger App and related information.
   */
  async function getLedgerAppAndInformation(): Promise<LedgerInformation> {
    try {
      const { ledgerAppName, rootNativeSegwitDerivationPath, rootTaprootDerivationPath } =
        getLedgerBitcoinNetworkInformation();
      const ledgerApp = await getLedgerApp(ledgerAppName);
      const masterFingerprint = await ledgerApp.getMasterFingerprint();

      return {
        ledgerApp,
        masterFingerprint,
        rootNativeSegwitDerivationPath,
        rootTaprootDerivationPath,
      };
    } catch (error: any) {
      throw new LedgerError(`Error getting Ledger App and Information: ${error}`);
    }
  }

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
    paymentType: 'wpkh' | 'tr'
  ): Promise<[string, number][]> {
    try {
      setIsLoading([true, 'Loading Ledger App and Information']);
      const currentLedgerInformation = await getLedgerAppAndInformation();
      if (!currentLedgerInformation) {
        throw new LedgerError(`Ledger Information is not available`);
      }
      setLedgerInformation(currentLedgerInformation);
      const {
        ledgerApp,
        masterFingerprint,
        rootNativeSegwitDerivationPath,
        rootTaprootDerivationPath,
      } = currentLedgerInformation;

      const indices = [0, 1, 2, 3, 4]; // Replace with your actual indices
      const addresses = [];

      setIsLoading([true, 'Loading Native Segwit Adresses']);
      for (const index of indices) {
        const derivationPath = `${paymentType === 'wpkh' ? rootNativeSegwitDerivationPath : rootTaprootDerivationPath}/${index}'`;
        const extendedPublicKey = await ledgerApp.getExtendedPubkey(`m${derivationPath}`);

        const accountPolicy = new DefaultWalletPolicy(
          `${paymentType}(@0/**)`,
          `[${masterFingerprint}/${derivationPath}]${extendedPublicKey}`
        );

        const address = await ledgerApp.getWalletAddress(accountPolicy, null, 0, 0, false);

        addresses.push(address);
      }

      const addressesWithBalances = await Promise.all(
        addresses.map(async address => {
          const balance = await getBalance(address, bitcoinBlockchainAPIURL); // Replace with your actual function to get balance
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

  /**
   * Gets the derived Native Segwit Account by the Native Segwit Address Index.
   * @param nativeSegwitAddressIndex The Native Segwit Address Index.
   * @returns A Promise that resolves when the Native Segwit Account is retrieved.
   */
  async function getNativeSegwitAccount(nativeSegwitAddressIndex: number): Promise<void> {
    try {
      setIsLoading([true, 'Retrieving Native Segwit Account']);
      let currentLedgerInformation: LedgerInformation | undefined;
      if (!ledgerInformation) {
        currentLedgerInformation = await getLedgerAppAndInformation();
        setLedgerInformation(currentLedgerInformation);
      } else {
        currentLedgerInformation = ledgerInformation;
      }

      const { ledgerApp, masterFingerprint, rootNativeSegwitDerivationPath } =
        currentLedgerInformation;

      const derivationPath = `${rootNativeSegwitDerivationPath}/${nativeSegwitAddressIndex}'`;

      // ==> Get Ledger First Native Segwit Extended Public Key
      const nativeSegwitExtendedPublicKey = await ledgerApp.getExtendedPubkey(
        `m/${derivationPath}`
      );

      // ==> Get Ledger First Native Segwit Account Policy
      const nativeSegwitAccountPolicy = new DefaultWalletPolicy(
        'wpkh(@0/**)',
        `[${masterFingerprint}/${derivationPath}]${nativeSegwitExtendedPublicKey}`
      );

      // ==> Get Ledger First Native Segwit Address
      const nativeSegwitAddress = await ledgerApp.getWalletAddress(
        nativeSegwitAccountPolicy,
        null,
        0,
        0,
        false
      );

      const nativeSegwitDerivedPublicKey = getDerivedPublicKey(
        nativeSegwitExtendedPublicKey,
        bitcoinNetwork
      );

      if (!nativeSegwitDerivedPublicKey) {
        throw new Error(
          `[Ledger] Could not derive Native Segwit Public Key from Ledger Extended Public Key`
        );
      }

      // ==> Get derivation path for Ledger Native Segwit Address
      const nativeSegwitPayment = p2wpkh(nativeSegwitDerivedPublicKey, bitcoinNetwork);

      if (nativeSegwitPayment.address !== nativeSegwitAddress) {
        throw new Error(
          `[Ledger] Recreated Native Segwit Address does not match the Ledger Native Segwit Address`
        );
      }

      setNativeSegwitAddressInformation({
        nativeSegwitAccountPolicy,
        nativeSegwitDerivedPublicKey,
        nativeSegwitPayment,
      });
      setBitcoinWalletContextState(BitcoinWalletContextState.NATIVE_SEGWIT_ADDRESS_READY);
      setIsLoading([false, '']);
    } catch (error: any) {
      setIsLoading([false, '']);
      throw new LedgerError(`Error getting Native Segwit Account: ${error}`);
    }
  }

  /**
   * Gets the Taproot Multisig Account, using the User's Public Key, th Attetor's Public Key, and the Unspendable Public Key.
   * @param vaultUUID The Vault UUID.
   * @returns A Promise that resolves when the Taproot Multisig Account is retrieved.
   */
  async function getTaprootMultisigAccount(vaultUUID: string): Promise<void> {
    try {
      setIsLoading([true, 'Creating Taproot Multisig Account Policy']);
      let currentLedgerInformation: LedgerInformation | undefined;
      if (!ledgerInformation) {
        currentLedgerInformation = await getLedgerAppAndInformation();
        setLedgerInformation(currentLedgerInformation);
      } else {
        currentLedgerInformation = ledgerInformation;
      }
      const { ledgerApp, masterFingerprint, rootTaprootDerivationPath } = currentLedgerInformation;

      const derivationPath = `${rootTaprootDerivationPath}/0'`;

      // ==> Get Ledger Derived Public Key
      const ledgerExtendedPublicKey = await ledgerApp.getExtendedPubkey(`m/${derivationPath}`);

      // ==> Get External Derived Public Keys
      const unspendableExtendedPublicKey = getUnspendableKeyCommittedToUUID(
        vaultUUID,
        bitcoinNetwork
      );

      const attestorExtendedPublicKey = await getAttestorGroupPublicKey(network);

      // ==> Create Key Info
      const ledgerKeyInfo = `[${masterFingerprint}/${derivationPath}]${ledgerExtendedPublicKey}`;

      // ==> Create Multisig Wallet Policy
      const taprootMultisigAccountPolicy = new WalletPolicy(
        `Taproot Multisig Wallet for Vault: ${easyTruncateAddress(vaultUUID)}`,
        `tr(@0/**,and_v(v:pk(@1/**),pk(@2/**)))`,
        [unspendableExtendedPublicKey, attestorExtendedPublicKey, ledgerKeyInfo]
      );

      setIsLoading([true, 'Accept Multisig Wallet Policy On Your Device']);

      // ==> Register Wallet
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, taprootMultisigPolicyHMac] = await ledgerApp.registerWallet(
        taprootMultisigAccountPolicy
      );

      // ==> Get Wallet Address from Ledger
      const taprootMultisigAddress = await ledgerApp.getWalletAddress(
        taprootMultisigAccountPolicy,
        taprootMultisigPolicyHMac,
        0,
        0,
        false
      );
      const attestorDerivedPublicKey = getDerivedPublicKey(
        attestorExtendedPublicKey,
        bitcoinNetwork
      );

      const unspendableDerivedPublicKey = getDerivedPublicKey(
        unspendableExtendedPublicKey,
        bitcoinNetwork
      );

      const userDerivedPublicKey = getDerivedPublicKey(ledgerExtendedPublicKey, bitcoinNetwork);

      // ==> Recreate Multisig Address to retrieve script
      const taprootMultisigPayment = createTaprootMultisigPayment(
        unspendableDerivedPublicKey,
        attestorDerivedPublicKey,
        userDerivedPublicKey,
        bitcoinNetwork
      );

      if (taprootMultisigAddress !== taprootMultisigPayment.address) {
        throw new Error(`Recreated Multisig Address does not match the Ledger Multisig Address`);
      }

      setTaprootMultisigAddressInformation({
        taprootMultisigAccountPolicy,
        taprootMultisigPolicyHMac,
        taprootMultisigPayment,
        userTaprootMultisigDerivedPublicKey: userDerivedPublicKey,
      });
      setBitcoinWalletContextState(BitcoinWalletContextState.TAPROOT_MULTISIG_ADDRESS_READY);
      setIsLoading([false, '']);
    } catch (error: any) {
      setIsLoading([false, '']);
      throw new LedgerError(`Error getting Taproot Multisig Account: ${error}`);
    }
  }

  /**
   * Creates the Funding Transaction and signs it with the Ledger Device.
   * @param vaultUUID The Vault UUID.
   * @returns The Signed Funding Transaction.
   */
  async function handleFundingTransaction(vaultUUID: string): Promise<Transaction> {
    try {
      setIsLoading([true, 'Creating Funding Transaction']);
      let currentLedgerInformation: LedgerInformation | undefined;
      if (!ledgerInformation) {
        currentLedgerInformation = await getLedgerAppAndInformation();
        setLedgerInformation(currentLedgerInformation);
      } else {
        currentLedgerInformation = ledgerInformation;
      }

      const vault: RawVault = await getRawVault(vaultUUID);

      const { ledgerApp, masterFingerprint } = currentLedgerInformation;
      const { nativeSegwitPayment, nativeSegwitDerivedPublicKey, nativeSegwitAccountPolicy } =
        nativeSegwitAddressInformation!;
      const { taprootMultisigPayment } = taprootMultisigAddressInformation!;

      const feeRate = await getFeeRate(bitcoinBlockchainAPIFeeURL);

      // ==> Create Funding Transaction
      const fundingPSBT = await createFundingTransaction(
        vault.valueLocked.toBigInt(),
        bitcoinNetwork,
        taprootMultisigPayment.address!,
        nativeSegwitPayment,
        BigInt(feeRate),
        vault.btcFeeRecipient,
        vault.btcMintFeeBasisPoints.toBigInt(),
        bitcoinBlockchainAPIURL
      );

      // ==> Update Funding PSBT with Ledger related information
      const signingConfiguration = createBitcoinInputSigningConfiguration(
        fundingPSBT,
        bitcoinNetwork
      );

      const formattedFundingPSBT = Psbt.fromBuffer(Buffer.from(fundingPSBT), {
        network: bitcoinNetwork,
      });

      const inputByPaymentTypeArray = getInputByPaymentTypeArray(
        signingConfiguration,
        formattedFundingPSBT.toBuffer(),
        bitcoinNetwork
      );

      const nativeSegwitInputsToSign = getNativeSegwitInputsToSign(inputByPaymentTypeArray);

      await updateNativeSegwitInputs(
        nativeSegwitInputsToSign,
        nativeSegwitDerivedPublicKey,
        masterFingerprint,
        formattedFundingPSBT,
        bitcoinBlockchainAPIURL
      );

      setIsLoading([true, 'Sign Funding Transaction on your Ledger Device']);
      // ==> Sign Funding PSBT with Ledger
      const fundingTransactionSignatures = await ledgerApp.signPsbt(
        formattedFundingPSBT.toBase64(),
        nativeSegwitAccountPolicy!,
        null
      );

      addNativeSegwitSignaturesToPSBT(formattedFundingPSBT, fundingTransactionSignatures);

      // ==> Finalize Funding Transaction
      const fundingTransaction = Transaction.fromPSBT(formattedFundingPSBT.toBuffer());
      fundingTransaction.finalize();

      setIsLoading([false, '']);
      return fundingTransaction;
    } catch (error) {
      setIsLoading([false, '']);
      throw new LedgerError(`Error handling Funding Transaction: ${error}`);
    }
  }

  /**
   * Creates the Closing Transaction and signs it with the Ledger Device.
   * @param vaultUUID The Vault UUID.
   * @param fundingTransactionID The Funding Transaction ID.
   * @returns The Partially Signed Closing Transaction HEX.
   */
  async function handleClosingTransaction(
    vaultUUID: string,
    fundingTransactionID: string
  ): Promise<string> {
    try {
      setIsLoading([true, 'Creating Closing Transaction']);
      let currentLedgerInformation: LedgerInformation | undefined;
      if (!ledgerInformation) {
        currentLedgerInformation = await getLedgerAppAndInformation();
        setLedgerInformation(currentLedgerInformation);
      } else {
        currentLedgerInformation = ledgerInformation;
      }

      const vault: RawVault = await getRawVault(vaultUUID);

      const { ledgerApp, masterFingerprint } = currentLedgerInformation;
      const { nativeSegwitPayment } = nativeSegwitAddressInformation!;
      const {
        taprootMultisigPayment,
        taprootMultisigAccountPolicy,
        userTaprootMultisigDerivedPublicKey,
        taprootMultisigPolicyHMac,
      } = taprootMultisigAddressInformation!;

      const feeRate = await getFeeRate(bitcoinBlockchainAPIFeeURL);
      // ==> Create Closing PSBT
      const closingPSBT = createClosingTransaction(
        vault.valueLocked.toBigInt(),
        bitcoinNetwork,
        fundingTransactionID,
        taprootMultisigPayment,
        nativeSegwitPayment.address!,
        BigInt(feeRate),
        vault.btcFeeRecipient,
        vault.btcRedeemFeeBasisPoints.toBigInt()
      );

      // ==> Update Closing PSBT with Ledger related information
      const closingTransactionSigningConfiguration = createBitcoinInputSigningConfiguration(
        closingPSBT,
        bitcoinNetwork
      );

      const formattedClosingPSBT = Psbt.fromBuffer(Buffer.from(closingPSBT), {
        network: bitcoinNetwork,
      });

      const closingInputByPaymentTypeArray = getInputByPaymentTypeArray(
        closingTransactionSigningConfiguration,
        formattedClosingPSBT.toBuffer(),
        bitcoinNetwork
      );

      const taprootInputsToSign = getTaprootInputsToSign(closingInputByPaymentTypeArray);

      await updateTaprootInputs(
        taprootInputsToSign,
        userTaprootMultisigDerivedPublicKey,
        masterFingerprint,
        formattedClosingPSBT
      );

      setIsLoading([true, 'Sign Closing Transaction on your Ledger Device']);
      // ==> Sign Closing PSBT with Ledger
      const closingTransactionSignatures = await ledgerApp.signPsbt(
        formattedClosingPSBT.toBase64(),
        taprootMultisigAccountPolicy!,
        taprootMultisigPolicyHMac!
      );

      addTaprootInputSignaturesToPSBT(formattedClosingPSBT, closingTransactionSignatures);

      setIsLoading([false, '']);
      return formattedClosingPSBT.toHex();
    } catch (error) {
      setIsLoading([false, '']);
      throw new LedgerError(`Error handling Closing Transaction: ${error}`);
    }
  }

  return {
    getLedgerAddressesWithBalances,
    getNativeSegwitAccount,
    getTaprootMultisigAccount,
    isLoading,
    handleFundingTransaction,
    handleClosingTransaction,
  };
}
