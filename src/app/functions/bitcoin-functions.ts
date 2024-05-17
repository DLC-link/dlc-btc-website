/** @format */
import { createRangeFromLength, isDefined, isUndefined, unshiftValue } from '@common/utilities';
import { LEDGER_APPS_MAP } from '@models/ledger.js';
import { hexToBytes } from '@noble/hashes/utils';
import { Transaction } from '@scure/btc-signer';
import {
  Address,
  OutScript,
  P2Ret,
  P2TROut,
  p2ms,
  p2pk,
  p2tr,
  p2tr_ns,
  p2wpkh,
} from '@scure/btc-signer';
import { TransactionInput } from '@scure/btc-signer';
import { taprootTweakPubkey } from '@scure/btc-signer';
import { BIP32Factory } from 'bip32';
import { Network, initEccLib } from 'bitcoinjs-lib';
import { bitcoin, testnet } from 'bitcoinjs-lib/src/networks.js';
import * as ellipticCurveCryptography from 'tiny-secp256k1';

import {
  BitcoinInputSigningConfig,
  BitcoinNetworkName,
  FeeRates,
  PaymentTypes,
  UTXO,
} from '@shared/models/bitcoin-models';
import { BitcoinError } from '@shared/models/error-types';

const TAPROOT_UNSPENDABLE_KEY_HEX =
  '0250929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0';
const ECDSA_PUBLIC_KEY_LENGTH = 33;

const bip32 = BIP32Factory(ellipticCurveCryptography);

export function getDerivedPublicKey(extendedPublicKey: string, bitcoinNetwork: Network) {
  return bip32.fromBase58(extendedPublicKey, bitcoinNetwork).derivePath('0/0').publicKey;
}

export function createTaprootMultisigPayment(
  unspendableDerivedPublicKey: Buffer,
  attestorDerivedPublicKey: Buffer,
  userDerivedPublicKey: Buffer,
  bitcoinNetwork: Network
): P2TROut {
  const taprootMultiLeafWallet = p2tr_ns(2, [
    attestorDerivedPublicKey.subarray(1),
    userDerivedPublicKey.subarray(1),
  ]);

  return p2tr(unspendableDerivedPublicKey.subarray(1), taprootMultiLeafWallet, bitcoinNetwork);
}

/**
 * Evaluates the fee rate from the bitcoin blockchain API.
 *
 * @returns The fee rate.
 */
function checkFeeRate(feeRate: number | undefined): number {
  if (!feeRate || feeRate < 2) {
    return 2;
  }
  return feeRate;
}

/**
 * Fetches the fee rate from the bitcoin blockchain API.
 *
 * @returns A promise that resolves to the hour fee rate.
 */
export async function getFeeRate(bitcoinBlockchainAPIFeeURL: string): Promise<number> {
  // const response = await fetch(bitcoinBlockchainAPIFeeURL);

  // if (!response.ok) {
  //   throw new BitcoinError(
  //     `Bitcoin Blockchain Fee Rate Response was not OK: ${response.statusText}`
  //   );
  // }

  // let feeRates: FeeRates;

  // try {
  //   feeRates = await response.json();
  // } catch (error) {
  //   throw new BitcoinError(`Error parsing Bitcoin Blockchain Fee Rate Response JSON: ${error}`);
  // }

  // const feeRate = checkFeeRate(feeRates.fastestFee);
  // const feeRateMultiplier: number = import.meta.env.VITE_FEE_RATE_MULTIPLIER || 1;
  // const doubledFeeRate = feeRate * feeRateMultiplier;

  return 147;
}

/**
 * Gets the UTXOs of the User's Native Segwit Address.
 *
 * @param bitcoinNativeSegwitTransaction - The User's Native Segwit Payment Transaction.
 * @returns A Promise that resolves to the UTXOs of the User's Native Segwit Address.
 */
export async function getUTXOs(
  bitcoinNativeSegwitTransaction: P2Ret,
  bitcoinBlockchainAPIURL: string
): Promise<any> {
  console.log('bitcoinNativeSegwitTransaction', bitcoinNativeSegwitTransaction);
  const utxoEndpoint = `${bitcoinBlockchainAPIURL}/address/${bitcoinNativeSegwitTransaction.address}/utxo`;
  console.log('utxoEndpoint', utxoEndpoint);
  const utxoResponse = await fetch(utxoEndpoint);

  console.log('utxoResponse', utxoResponse);

  if (!utxoResponse.ok) {
    throw new BitcoinError(`Error getting UTXOs: ${utxoResponse.statusText}`);
  }

  const userUTXOs = await utxoResponse.json();

  const modifiedUTXOs = await Promise.all(
    userUTXOs.map(async (utxo: UTXO) => {
      return {
        ...bitcoinNativeSegwitTransaction,
        txid: utxo.txid,
        index: utxo.vout,
        value: utxo.value,
        witnessUtxo: {
          script: bitcoinNativeSegwitTransaction.script,
          amount: BigInt(utxo.value),
        },
        redeemScript: bitcoinNativeSegwitTransaction.redeemScript,
      };
    })
  );
  return modifiedUTXOs;
}

export async function getBalance(
  bitcoinAddress: string,
  bitcoinBlockchainAPIURL: string
): Promise<number> {
  const utxoResponse = await fetch(`${bitcoinBlockchainAPIURL}/address/${bitcoinAddress}/utxo`);

  if (!utxoResponse.ok) {
    throw new BitcoinError(`Error getting UTXOs: ${utxoResponse.statusText}`);
  }

  const userUTXOs: UTXO[] = await utxoResponse.json();

  const balanceInSats = userUTXOs.reduce((total, utxo) => total + utxo.value, 0);

  return unshiftValue(balanceInSats);
}

/**
 * Gets the Fee Recipient's Address from the Rcipient's Public Key.
 * @param feePublicKey - The Fee Recipient's Public Key.
 * @param bitcoinNetwork - The Bitcoin Network to use.
 * @returns The Fee Recipient's Address.
 */
export function getFeeRecipientAddressFromPublicKey(
  feePublicKey: string,
  bitcoinNetwork: Network
): string {
  const feePublicKeyBuffer = Buffer.from(feePublicKey, 'hex');
  const { address } = p2wpkh(feePublicKeyBuffer, bitcoinNetwork);
  if (!address) throw new BitcoinError('Could not create Fee Address from Public Key');
  return address;
}

/**
 * Creates a Multisig Transaction using the Public Key of the User's Taproot Address and the Attestor Group's Public Key.
 * The Funding Transaction is sent to the Multisig Address.
 *
 * @param userPublicKey - The Public Key of the User's Taproot Address.
 * @param attestorGroupPublicKey - The Attestor Group's Public Key.
 * @param vaultUUID - The UUID of the Vault.
 * @param bitcoinNetwork - The Bitcoin Network to use.
 * @param unspendablePublicKey - (Optional) The Unspendable Public Key.
 * @returns The Multisig Transaction.
 */
export function createMultisigTransaction(
  userPublicKey: Uint8Array,
  attestorGroupPublicKey: Uint8Array,
  vaultUUID: string,
  bitcoinNetwork: Network,
  unspendablePublicKey?: Uint8Array
): P2TROut {
  const multisig = p2tr_ns(2, [userPublicKey, attestorGroupPublicKey]);

  if (unspendablePublicKey) {
    const multisigTransaction = p2tr(unspendablePublicKey, multisig, bitcoinNetwork);
    multisigTransaction.tapInternalKey = unspendablePublicKey;
    return multisigTransaction;
  }

  const unspendablePublicKeyBytes = hexToBytes(TAPROOT_UNSPENDABLE_KEY_HEX);

  const tweakedUnspendableWithUUID = taprootTweakPubkey(
    unspendablePublicKeyBytes,
    Buffer.from(vaultUUID)
  )[0];
  const multisigTransaction = p2tr(tweakedUnspendableWithUUID, multisig, bitcoinNetwork);
  multisigTransaction.tapInternalKey = tweakedUnspendableWithUUID;

  return multisigTransaction;
}

/**
 * Broadcasts the Transaction to the Bitcoin Network.
 *
 * @param transaction - The Transaction to broadcast.
 * @returns A Promise that resolves to the Response from the Broadcast Request.
 */
export async function broadcastTransaction(
  transaction: string,
  bitcoinBlockchainAPIURL: string
): Promise<string> {
  try {
    const response = await fetch(`${bitcoinBlockchainAPIURL}/tx`, {
      method: 'POST',
      body: transaction,
    });

    if (!response.ok) {
      throw new BitcoinError(
        `Error while broadcasting Bitcoin Transaction: ${await response.text()}`
      );
    }

    const transactionID = await response.text();

    return transactionID;
  } catch (error) {
    throw new Error(`Error broadcasting Transaction: ${error}`);
  }
}

// create extended public key from public key
export function getUnspendableKeyCommittedToUUID(vaultUUID: string, bitcoinNetwork: Network) {
  const publicKeyBuffer = Buffer.from(TAPROOT_UNSPENDABLE_KEY_HEX, 'hex');
  const chainCodeBuffer = Buffer.from(vaultUUID.slice(2), 'hex');

  const derivedPublicKey = bip32
    .fromPublicKey(publicKeyBuffer, chainCodeBuffer, bitcoinNetwork)
    .toBase58();

  return derivedPublicKey;
}

/**
 * Returns the Payment Type of the Input.
 * @param index - A number that refers to the position of the output that will be utilized as an input.
 * @param input - The Input.
 * @param bitcoinNetwork - The Bitcoin Network to use.
 */
export function getInputPaymentType(
  index: number,
  input: TransactionInput,
  bitcoinNetwork: Network
): PaymentTypes {
  const bitcoinAddress = getBitcoinInputAddress(index, input, bitcoinNetwork);

  if (bitcoinAddress === '') throw new BitcoinError('Bitcoin Address is empty');
  if (
    bitcoinAddress.startsWith('bc1p') ||
    bitcoinAddress.startsWith('tb1p') ||
    bitcoinAddress.startsWith('bcrt1p')
  )
    return 'p2tr';
  if (
    bitcoinAddress.startsWith('bc1q') ||
    bitcoinAddress.startsWith('tb1q') ||
    bitcoinAddress.startsWith('bcrt1q')
  )
    return 'p2wpkh';
  throw new Error('Unable to infer payment type from BitcoinAddress');
}

/**
 * Returns the Bitcoin Address of the Input.
 * @param index - A number that refers to the position of the output that will be utilized as an input.
 * @param input - The Input.
 * @param bitcoinNetwork - The Bitcoin Network to use.
 */
export function getBitcoinInputAddress(
  index: number,
  input: TransactionInput,
  bitcoinNetwork: Network
) {
  if (isDefined(input.witnessUtxo))
    return getAddressFromOutScript(input.witnessUtxo.script, bitcoinNetwork);
  if (isDefined(input.nonWitnessUtxo))
    return getAddressFromOutScript(input.nonWitnessUtxo.outputs[index]?.script, bitcoinNetwork);
  return '';
}

/**
 * Returns the Bitcoin Address from the Output Script.
 * @param script - The Output Script.
 * @param bitcoinNetwork - The Bitcoin Network to use.
 */
export function getAddressFromOutScript(script: Uint8Array, bitcoinNetwork: Network) {
  const outputScript = OutScript.decode(script);

  switch (outputScript.type) {
    case 'pkh':
    case 'sh':
    case 'wpkh':
    case 'wsh':
      return Address(bitcoinNetwork).encode({
        type: outputScript.type,
        hash: outputScript.hash,
      });
    case 'tr':
      return Address(bitcoinNetwork).encode({
        type: outputScript.type,
        pubkey: outputScript.pubkey,
      });
    case 'ms':
      return p2ms(outputScript.m, outputScript.pubkeys).address ?? '';
    case 'pk':
      return p2pk(outputScript.pubkey, bitcoinNetwork).address ?? '';
    case 'tr_ms':
    case 'tr_ns':
      throw new BitcoinError('Unsupported Script Type');
    case 'unknown':
      throw new BitcoinError('Unknown Script Type');
    default:
      throw new BitcoinError('Unsupported Script Type');
  }
}

/**
 * Creates the Bitcoin Input Signing Configuration.
 * @param psbt - The PSBT from which to create the Configuration.
 * @param bitcoinNetwork - The Bitcoin Network to use.
 * @returns The Bitcoin Input Signing Configuration.
 */
export function createBitcoinInputSigningConfiguration(
  psbt: Uint8Array,
  bitcoinNetwork: Network
): BitcoinInputSigningConfig[] {
  let nativeSegwitDerivationPath = '';
  let taprootDerivationPath = '';

  switch (bitcoinNetwork) {
    case bitcoin:
      nativeSegwitDerivationPath = "m/84'/0'/0'/0/0";
      taprootDerivationPath = "m/86'/0'/0'/0/0";
      break;
    case testnet:
      nativeSegwitDerivationPath = "m/84'/1'/0'/0/0";
      taprootDerivationPath = "m/86'/1'/0'/0/0";
      break;
    default:
      throw new BitcoinError('Unsupported Bitcoin Network');
  }

  const transaction = Transaction.fromPSBT(psbt);
  const indexesToSign = createRangeFromLength(transaction.inputsLength);
  return indexesToSign.map(inputIndex => {
    const input = transaction.getInput(inputIndex);

    if (isUndefined(input.index)) throw new Error('Input must have an index for payment type');
    const paymentType = getInputPaymentType(input.index, input, bitcoinNetwork);

    switch (paymentType) {
      case 'p2wpkh':
        return {
          index: inputIndex,
          derivationPath: nativeSegwitDerivationPath,
        };
      case 'p2tr':
        return {
          index: inputIndex,
          derivationPath: taprootDerivationPath,
        };
      default:
        throw new BitcoinError('Unsupported Payment Type');
    }
  });
}

/**
 * Returns the Bitcoin Input Signing Configuration and Payment Type Array for the given PSBT.
 * @param signingConfiguration - The Bitcoin Input Signing Configuration.
 * @param psbt - The PSBT.
 * @param bitcoinNetwork - The Bitcoin Network to use.
 */
export function getInputByPaymentTypeArray(
  signingConfiguration: BitcoinInputSigningConfig[],
  psbt: Buffer,
  bitcoinNetwork: Network
): [BitcoinInputSigningConfig, PaymentTypes][] {
  const transaction = Transaction.fromPSBT(psbt);

  return signingConfiguration.map(config => {
    const inputIndex = transaction.getInput(config.index).index;
    if (isUndefined(inputIndex)) throw new Error('Input must have an index for payment type');
    return [
      config,
      getInputPaymentType(inputIndex, transaction.getInput(config.index), bitcoinNetwork),
    ];
  });
}

/**
 * Converts an ECDSA Public Key to a Schnorr Public Key.
 * @param publicKey - The ECDSA Public Key.
 */
export function ecdsaPublicKeyToSchnorr(publicKey: Buffer) {
  if (publicKey.byteLength !== ECDSA_PUBLIC_KEY_LENGTH)
    throw new Error('Invalid Public Key Length');
  return publicKey.subarray(1);
}
