/** @format */
import { unshiftValue } from '@common/utilities';
import { P2TROut, p2tr, p2tr_ns } from '@scure/btc-signer';
import { BIP32Factory } from 'bip32';
import { Network, UTXO } from 'dlc-btc-lib/models';
import * as ellipticCurveCryptography from 'tiny-secp256k1';

import { BitcoinError } from '@shared/models/error-types';

const TAPROOT_UNSPENDABLE_KEY_HEX =
  '0250929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0';

const bip32 = BIP32Factory(ellipticCurveCryptography);

/**
 * Gets the derived public key from the extended public key.
 * @param extendedPublicKey - The Extended Public Key.
 * @param bitcoinNetwork - The Bitcoin Network to use.
 * @returns The Derived Public Key.
 */
export function getDerivedPublicKey(extendedPublicKey: string, bitcoinNetwork: Network): Buffer {
  return bip32.fromBase58(extendedPublicKey, bitcoinNetwork).derivePath('0/0').publicKey;
}

function getXOnlyPublicKey(publicKey: Buffer): Buffer {
  return publicKey.length === 32 ? publicKey : publicKey.subarray(1);
}

/**
 * Creates a Taproot Multisig Payment.
 * @param unspendableDerivedPublicKey - The Unspendable Derived Public Key.
 * @param attestorDerivedPublicKey - The Attestor Derived Public Key.
 * @param userDerivedPublicKey - The User Derived Public Key.
 * @param bitcoinNetwork - The Bitcoin Network to use.
 * @returns The Taproot Multisig Payment.
 */
export function createTaprootMultisigPayment(
  unspendableDerivedPublicKey: Buffer,
  publicKeyA: Buffer,
  publicKeyB: Buffer,
  bitcoinNetwork: Network
): P2TROut {
  const unspendableDerivedPublicKeyFormatted = getXOnlyPublicKey(unspendableDerivedPublicKey);

  const publicKeys = [getXOnlyPublicKey(publicKeyA), getXOnlyPublicKey(publicKeyB)];
  const sortedArray = publicKeys.sort((a, b) => (a.toString('hex') > b.toString('hex') ? 1 : -1));

  const taprootMultiLeafWallet = p2tr_ns(2, sortedArray);

  return p2tr(unspendableDerivedPublicKeyFormatted, taprootMultiLeafWallet, bitcoinNetwork);
}

/**
 * Gets the Balance of the User's Bitcoin Address.
 *
 * @param bitcoinAddress - The User's Bitcoin Address.
 * @returns A Promise that resolves to the Balance of the User's Bitcoin Address.
 */
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

/**
 * Creates an Unspendable Key Committed to the Vault UUID.
 * @param vaultUUID - The UUID of the Vault.
 * @param bitcoinNetwork - The Bitcoin Network to use.
 * @returns The Unspendable Key Committed to the Vault UUID.
 */
export function getUnspendableKeyCommittedToUUID(
  vaultUUID: string,
  bitcoinNetwork: Network
): string {
  const publicKeyBuffer = Buffer.from(TAPROOT_UNSPENDABLE_KEY_HEX, 'hex');
  const chainCodeBuffer = Buffer.from(vaultUUID.slice(2), 'hex');

  const unspendablePublicKey = bip32
    .fromPublicKey(publicKeyBuffer, chainCodeBuffer, bitcoinNetwork)
    .toBase58();

  return unspendablePublicKey;
}
