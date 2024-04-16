import { customShiftValue } from '@common/utilities';
import { BitcoinNetwork } from '@models/bitcoin-network';
import { BitcoinError } from '@models/error-types';
import { ethereumArbSepolia } from '@models/ethereum-network';
import { Vault } from '@models/vault';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { hex } from '@scure/base';
import * as btc from '@scure/btc-signer';
import { payments } from 'bitcoinjs-lib';

import { useAttestors } from './use-attestors';
import { useEndpoints } from './use-endpoints';
import { useEthereum } from './use-ethereum';

const networkModes = ['mainnet', 'testnet', 'regtest'] as const;

type NetworkModes = (typeof networkModes)[number];

declare enum SignatureHash {
  ALL = 1,
  NONE = 2,
  SINGLE = 3,
  ALL_ANYONECANPAY = 129,
  NONE_ANYONECANPAY = 130,
  SINGLE_ANYONECANPAY = 131,
}
interface SignPsbtRequestParams {
  hex: string;
  allowedSighash?: SignatureHash[];
  signAtIndex?: number | number[]; // default is all inputs
  network?: NetworkModes; // default is user's current network
  account?: number; // default is user's current account
  broadcast?: boolean; // default is false - finalize/broadcast tx
}

interface TransactionStatus {
  confirmed: boolean;
  block_height: number;
  block_hash: string;
  block_time: number;
}

interface UTXO {
  txid: string;
  vout: number;
  status: TransactionStatus;
  value: number;
}

interface FeeRates {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}

interface BitcoinNativeSegwitAddress {
  address: string;
  derivationPath: string;
  publicKey: string;
  symbol: string;
  type: string;
}

interface BitcoinTaprootAddress extends BitcoinNativeSegwitAddress {
  type: 'p2tr';
  tweakedPublicKey: string;
}

interface StacksAddress {
  address: string;
  symbol: string;
}

type Address = BitcoinNativeSegwitAddress | BitcoinTaprootAddress | StacksAddress;
interface RpcResult {
  addresses: Address[];
}

interface RpcResponse {
  id: string;
  jsonrpc: string;
  result: RpcResult;
}

interface UseBitcoinReturnType {
  signAndBroadcastFundingPSBT: (vault: Vault) => Promise<{
    fundingTransaction: btc.Transaction;
    multisigTransaction: btc.P2TROut;
    userNativeSegwitAddress: string;
    attestorGroupPublicKey: string;
  }>;
  signAndSendClosingPSBT: (
    fundingTransaction: btc.Transaction,
    multisigTransaction: btc.P2TROut,
    userNativeSegwitAddress: string,
    vault: Vault
  ) => Promise<void>;
  broadcastTransaction: (transaction: btc.Transaction) => Promise<string>;
}

export function useBitcoin(): UseBitcoinReturnType {
  const { bitcoinNetwork, bitcoinNetworkName, bitcoinBlockchainAPIURL, mempoolSpaceAPIFeeURL } =
    useEndpoints();
  const { sendClosingTransactionToAttestors } = useAttestors();
  const { getAttestorGroupPublicKey } = useEthereum();

  /**
   * Checks if the user's wallet is on the same network as the app.
   *
   * @param userNativeSegwitAddress - The user's native segwit address.
   * @throws BitcoinError - If the user's wallet is not on the same network as the app.
   */
  function checkUserWalletNetwork(userNativeSegwitAddress: Address): void {
    if (bitcoinNetworkName === 'mainnet' && !userNativeSegwitAddress.address.startsWith('bc1')) {
      throw new BitcoinError('User wallet is not on Bitcoin Mainnet');
    } else if (
      bitcoinNetworkName === 'testnet' &&
      !userNativeSegwitAddress.address.startsWith('tb1')
    ) {
      throw new BitcoinError('User wallet is not on Bitcoin Testnet');
    } else if (
      bitcoinNetworkName === 'regtest' &&
      !userNativeSegwitAddress.address.startsWith('bcrt1')
    ) {
      throw new BitcoinError('User wallet is not on Bitcoin Regtest');
    } else {
      return;
    }
  }

  /**
   * Fetches the user's native segwit and taproot addresses from the user's wallet. Taproot address is required for the user's public key, which is used in the multisig transaction.
   * Current implementation is using Leather Wallet.
   *
   * @returns A promise that resolves to the user's native segwit and taproot addresses.
   */
  async function getBitcoinAddresses(): Promise<Address[]> {
    try {
      const rpcResponse: RpcResponse = await window.btc?.request('getAddresses');
      const userAddresses = rpcResponse.result.addresses;
      checkUserWalletNetwork(userAddresses[0]);
      return userAddresses;
    } catch (error) {
      throw new BitcoinError(`Error getting bitcoin addresses: ${error}`);
    }
  }

  /**
   * Fetches the fee rate from the mempool.space API.
   *
   * @returns A promise that resolves to the hour fee rate.
   */
  async function getFeeRate(): Promise<number> {
    try {
      const response = await fetch(mempoolSpaceAPIFeeURL);
      const feeRates: FeeRates = await response.json();

      return feeRates.fastestFee;
    } catch (error) {
      throw new BitcoinError(`Error getting Fee Rate: ${error}`);
    }
  }

  /**
   * Fetches the UTXOs for the user's native segwit address.

   *
   * @param bitcoinNativeSegwitAddress - The user's native segwit address.
   * @returns A promise that resolves to the UTXOs.
   */
  async function getUTXOs(bitcoinNativeSegwitAddress: BitcoinNativeSegwitAddress): Promise<any> {
    try {
      const response = await fetch(
        `${bitcoinBlockchainAPIURL}/address/${bitcoinNativeSegwitAddress.address}/utxo`
      );
      const allUTXOs = await response.json();
      const userPublicKey = hexToBytes(bitcoinNativeSegwitAddress.publicKey);
      const spend = btc.p2wpkh(userPublicKey, bitcoinNetwork);

      const utxos = await Promise.all(
        allUTXOs.map(async (utxo: UTXO) => {
          const txHex = await (
            await fetch(`${bitcoinBlockchainAPIURL}/tx/${utxo.txid}/hex`)
          ).text();
          return {
            ...spend,
            txid: utxo.txid,
            index: utxo.vout,
            value: utxo.value,
            nonWitnessUtxo: hex.decode(txHex),
          };
        })
      );
      return utxos;
    } catch (error) {
      throw new BitcoinError(`Error getting UTXOs: ${error}`);
    }
  }

  /**
   * Creates a multisig transaction using the user's public key and the attestor group's public key.
   * The funding transaction is sent to the multisig address.
   *
   * @param userPublicKey - The user's public key.
   * @param attestorGroupPublicKey - The attestor group's public key.
   * @param bitcoinNetwork - The bitcoin network.
   * @returns A promise that resolves to the multisig transaction.
   */
  function createMultisigTransaction(
    userPublicKey: Uint8Array,
    attestorGroupPublicKey: Uint8Array,
    uuid: string,
    bitcoinNetwork: BitcoinNetwork
  ): btc.P2TROut {
    const multisig = btc.p2tr_ns(2, [userPublicKey, attestorGroupPublicKey]);

    // The following is taken from the https://github.com/paulmillr/scure-btc-signer
    // Another stupid decision, where lack of standard affects security.
    // Multisig needs to be generated with some key.
    // We are using approach from BIP 341/bitcoinjs-lib: SHA256(uncompressedDER(SECP256K1_GENERATOR_POINT))
    // It is possible to switch SECP256K1_GENERATOR_POINT with some random point;
    // but it's too complex to prove.
    // Also used by bitcoin-core and bitcoinjs-lib
    const TAPROOT_UNSPENDABLE_KEY_STR =
      '50929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0';
    const TAPROOT_UNSPENDABLE_KEY = hexToBytes(TAPROOT_UNSPENDABLE_KEY_STR);

    const tweakedUnspendableWithUUID = btc.taprootTweakPubkey(
      TAPROOT_UNSPENDABLE_KEY,
      Buffer.from(uuid)
    )[0];
    const multisigTransaction = btc.p2tr(tweakedUnspendableWithUUID, multisig, bitcoinNetwork);
    multisigTransaction.tapInternalKey = tweakedUnspendableWithUUID;

    return multisigTransaction;
  }

  /**
   * Creates the first PSBT, which is the funding transaction.
   * Uses the selected UTXOs to fund the transaction.
   *
   * @param multisigAddress - The multisig address created from the multisig transaction between the user and the attestor group.
   * @param utxos - The user's UTXOs.
   * @param feeRate - The fee rate.
   * @param bitcoinAmount - The amount of bitcoin to be used in the transaction.
   * @param bitcoinNetwork - The bitcoin network.
   * @returns A promise that resolves to the funding PSBT.
   */ function createFundingTransaction(
    multisigAddress: string,
    userChangeAddress: string,
    utxos: any[],
    feeRate: bigint,
    feePublicKey: string,
    feeBasisPoints: number,
    bitcoinAmount: number,
    bitcoinNetwork: BitcoinNetwork
  ): Uint8Array {
    const feePublicKeyBuffer = Buffer.from(feePublicKey, 'hex');
    const feeAddress = payments.p2wpkh({
      pubkey: feePublicKeyBuffer,
      network: bitcoinNetwork,
    }).address as string;

    const outputs = [
      { address: multisigAddress, amount: BigInt(customShiftValue(bitcoinAmount, 8, false)) },
      {
        address: feeAddress,
        amount: BigInt(customShiftValue(bitcoinAmount, 8, false) * feeBasisPoints),
      },
    ];

    const selected = btc.selectUTXO(utxos, outputs, 'default', {
      changeAddress: userChangeAddress,
      feePerByte: feeRate,
      bip69: false,
      createTx: true,
      network: bitcoinNetwork,
    });

    const fundingTX = selected?.tx;

    if (!fundingTX) throw new BitcoinError('Could not create Funding Transaction');

    const fundingPSBT = fundingTX.toPSBT();

    return fundingPSBT;
  }

  /**
   * Creates the second PSBT, which is the closing transaction.
   * Uses the funding transaction ID to create the closing transaction.
   * The closing transaction is sent to the user's native segwit address.
   *
   * @param fundingTransactionID - The ID of the funding transaction.
   * @param multisigTransaction - The multisig transaction between the user and the attestor group.
   * @param userNativeSegwitAddress - The user's native segwit address.
   * @param bitcoinAmount - The amount of bitcoin to be used in the transaction.
   * @param bitcoinNetwork - The bitcoin network.
   * @returns A promise that resolves to the closing PSBT.
   */
  async function createClosingTransaction(
    fundingTransactionID: string,
    multisigTransaction: btc.P2TROut,
    userNativeSegwitAddress: string,
    feePublicKey: string,
    feeBasisPoints: number,
    bitcoinAmount: number,
    bitcoinNetwork: BitcoinNetwork
  ): Promise<Uint8Array> {
    const feePublicKeyBuffer = Buffer.from(feePublicKey, 'hex');
    const feeAddress = payments.p2wpkh({
      pubkey: feePublicKeyBuffer,
      network: bitcoinNetwork,
    }).address as string;

    const inputs = [
      {
        txid: hexToBytes(fundingTransactionID),
        index: 0,
        witnessUtxo: {
          amount: BigInt(customShiftValue(bitcoinAmount, 8, false)),
          script: multisigTransaction.script,
        },
        ...multisigTransaction,
      },
    ];

    const outputs = [
      {
        address: feeAddress,
        amount: BigInt(customShiftValue(bitcoinAmount, 8, false) * feeBasisPoints),
      },
    ];

    const feeRate = BigInt(await getFeeRate());

    const selected = btc.selectUTXO(inputs, outputs, 'default', {
      changeAddress: userNativeSegwitAddress,
      feePerByte: feeRate,
      bip69: false,
      createTx: true,
      network: bitcoinNetwork,
    });

    if (!selected?.tx) throw new BitcoinError('Could not create Closing Transaction');

    const closingPSBT = selected.tx.toPSBT();

    return closingPSBT;
  }

  /**
   * Signs the PSBTs. Requests the user's wallet to sign the PSBT.
   * Current implementation is using Leather Wallet.
   *
   * @param psbt - The PSBT to sign.
   * @returns A promise that resolves to the signed PSBT.
   */
  async function signPSBT(psbt: Uint8Array): Promise<string> {
    try {
      const requestParams: SignPsbtRequestParams = {
        hex: bytesToHex(psbt),
      };
      const result = await window.btc.request('signPsbt', requestParams);
      return result.result.hex;
    } catch (error) {
      throw new BitcoinError(`Error signing PSBT: ${error}`);
    }
  }

  /**
   * Broadcasts the funding transaction. The PSBTs are only signed by the user's wallet, the broadcast happens here.
   *
   * @param transaction - The transaction to broadcast.
   * @returns A promise that resolves to the response from the broadcast request.
   */
  async function broadcastTransaction(transaction: btc.Transaction): Promise<string> {
    try {
      const response = await fetch(`${bitcoinBlockchainAPIURL}/tx`, {
        method: 'POST',
        body: bytesToHex(transaction.extract()),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const transactionID = await response.text();
      return transactionID;
    } catch (error) {
      throw new BitcoinError(`Error broadcasting transaction: ${error}`);
    }
  }

  /**
   * This function is responsible for signing the funding PSBT using the user's wallet and then broadcasting the transaction.
   *
   * @param bitcoinAmount - The amount of bitcoin to be used in the transaction.
   * @returns A promise that resolves when the transaction has been successfully broadcasted.
   */
  async function signAndBroadcastFundingPSBT(vault: Vault): Promise<{
    fundingTransaction: btc.Transaction;
    multisigTransaction: btc.P2TROut;
    userNativeSegwitAddress: string;
    attestorGroupPublicKey: string;
  }> {
    const userAddresses = await getBitcoinAddresses();
    const userNativeSegwitAccount = userAddresses[0] as BitcoinNativeSegwitAddress;
    const userNativeSegwitAddress = userNativeSegwitAccount.address;
    const userTaprootAddress = userAddresses[1] as BitcoinTaprootAddress;
    const userPublicKey = userTaprootAddress.tweakedPublicKey;

    const attestorGroupPublicKey = await getAttestorGroupPublicKey(ethereumArbSepolia);

    const userUTXOs = await getUTXOs(userAddresses[0] as BitcoinNativeSegwitAddress);
    const multisigTransaction = createMultisigTransaction(
      hex.decode(userPublicKey),
      hex.decode(attestorGroupPublicKey),
      vault.uuid,
      bitcoinNetwork
    );

    const multisigAddress = multisigTransaction.address;
    if (!multisigAddress) throw new BitcoinError('Could not create multisig address');

    const feeRate = BigInt(await getFeeRate());

    const fundingTransaction = createFundingTransaction(
      multisigAddress,
      userNativeSegwitAddress,
      userUTXOs,
      feeRate,
      vault.btcFeeRecipient,
      vault.btcMintFeeBasisPoints,
      vault.collateral,
      bitcoinNetwork
    );

    const fundingTransactionHex = await signPSBT(fundingTransaction);

    const transaction = btc.Transaction.fromPSBT(hexToBytes(fundingTransactionHex));
    transaction.finalize();

    return {
      fundingTransaction: transaction,
      multisigTransaction,
      userNativeSegwitAddress,
      attestorGroupPublicKey,
    };
  }

  /**
   * This function is responsible for signing the closing PSBT using the user's wallet and then sending the closing transaction to the attestors.
   *
   * @param fundingTransactionID - The ID of the funding transaction.
   * @param multisigTransaction - The multisig transaction.
   * @param uuid - The UUID of the vault.
   * @param userNativeSegwitAddress - The user's native segwit address.
   * @param bitcoinAmount - The amount of bitcoin.
   * @returns A promise that resolves when the transaction has been successfully sent to the attestors.
   */
  async function signAndSendClosingPSBT(
    fundingTransaction: btc.Transaction,
    multisigTransaction: btc.P2TROut,
    userNativeSegwitAddress: string,
    vault: Vault
  ): Promise<void> {
    const closingTransaction = await createClosingTransaction(
      fundingTransaction.id,
      multisigTransaction,
      userNativeSegwitAddress,
      vault.btcFeeRecipient,
      vault.btcRedeemFeeBasisPoints,
      vault.collateral,
      bitcoinNetwork
    );
    const closingTransactionHex = await signPSBT(closingTransaction);

    await sendClosingTransactionToAttestors(
      fundingTransaction.hex,
      closingTransactionHex,
      vault.uuid,
      userNativeSegwitAddress
    );
  }

  return {
    signAndBroadcastFundingPSBT,
    signAndSendClosingPSBT,
    broadcastTransaction,
  };
}
