import { unshiftValue } from '@common/utilities';
import { UTXO } from '@models/bitcoin-transaction';
import { BitcoinError } from '@models/error-types';
import { P2TROut, p2tr, p2tr_ns } from '@scure/btc-signer';
import { BIP32Factory } from 'bip32';
import { Network } from 'bitcoinjs-lib';
import * as ellipticCurveCryptography from 'tiny-secp256k1';

const TAPROOT_UNSPENDABLE_KEY_HEX =
  '0250929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0';

const bip32 = BIP32Factory(ellipticCurveCryptography);

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

// create extended public key from public key
export function getUnspendableKeyCommittedToUUID(vaultUUID: string, bitcoinNetwork: Network) {
  const publicKeyBuffer = Buffer.from(TAPROOT_UNSPENDABLE_KEY_HEX, 'hex');
  const chainCodeBuffer = Buffer.from(vaultUUID.slice(2), 'hex');

  const derivedPublicKey = bip32
    .fromPublicKey(publicKeyBuffer, chainCodeBuffer, bitcoinNetwork)
    .toBase58();

  return derivedPublicKey;
}

export function getDerivedPublicKey(extendedPublicKey: string, bitcoinNetwork: Network) {
  return bip32.fromBase58(extendedPublicKey, bitcoinNetwork).derivePath('0/0').publicKey;
}
