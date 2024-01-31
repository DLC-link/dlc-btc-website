import { useEffect, useState } from 'react';

import { BitcoinNetwork, regtest } from '@models/bitcoin-network';
import { BitcoinError } from '@models/error-types';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { hex } from '@scure/base';
import * as btc from '@scure/btc-signer';
import { concatBytes } from 'micro-packed';

const networkModes = ['mainnet', 'testnet'] as const;

export type NetworkModes = (typeof networkModes)[number];

type BitcoinTestnetModes = 'testnet' | 'regtest' | 'signet';

export type BitcoinNetworkModes = NetworkModes | BitcoinTestnetModes;

export declare enum SignatureHash {
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
  signAtIndex?: number | number[];
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

interface BitcoinAddresses {
  nativeSegwit: BitcoinNativeSegwitAddress;
  taproot: BitcoinTaprootAddress;
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

export interface UseBitcoinReturnType {
  test: () => Promise<void>;
  bitcoinPrice: number;
}

const ELECTRUM_API_URL = 'https://devnet.dlc.link/electrs';

export function useBitcoin(): UseBitcoinReturnType {
  const [bitcoinPrice, setBitcoinPrice] = useState(0);

  useEffect(() => {
    const getBitcoinPrice = async () => {
      await fetchBitcoinPrice();
    };
    getBitcoinPrice();
  }, []);

  async function getBitcoinAddresses(): Promise<Address[]> {
    console.log('getBitcoinAddresses');
    const rpcResponse: RpcResponse = await window.btc?.request('getAddresses');
    const userAddresses = rpcResponse.result.addresses;
    return userAddresses;
  }

  async function gatherUTXOs(bitcoinNativeSegwitAddress: BitcoinNativeSegwitAddress): Promise<any> {
    console.log('gatherUTXOs');
    const response = await fetch(
      `${ELECTRUM_API_URL}/address/${bitcoinNativeSegwitAddress.address}/utxo`
    );
    const allUTXOs = await response.json();
    const spend = btc.p2wpkh(bitcoinNativeSegwitAddress.publicKey, regtest);

    const utxos = await Promise.all(
      allUTXOs.map(async (utxo: UTXO) => {
        const txHex = await (await fetch(`${ELECTRUM_API_URL}/tx/${utxo.txid}/hex`)).text();
        return {
          ...spend,
          txid: utxo.txid,
          index: utxo.vout,
          value: utxo.value,
          nonWitnessUtxo: hex.decode(txHex),
          // script: utxo.scriptpubkey, //do i need to handle when it is witness? how?
        };
      })
    );

    return utxos;
  }

  function createTaprootTree(
    userTimeoutPublicKey: Uint8Array,
    userPublicKey: Uint8Array,
    attestorsPublicKey: Uint8Array,
    hash: Uint8Array
  ): btc.TaprootScriptTree {
    console.log('createTaprootTree');
    const timeoutScript = new Uint8Array([
      0x02,
      144,
      0x00,
      btc.OP.CHECKSEQUENCEVERIFY,
      btc.OP.DROP,
      0x20,
      ...userTimeoutPublicKey,
      btc.OP.CHECKSIG,
    ]);

    const hashScript = new Uint8Array([
      btc.OP.SHA256,
      0x20,
      ...hash,
      btc.OP.EQUALVERIFY,
      0x20,
      ...userPublicKey,
      btc.OP.CHECKSIG,
      0x20,
      ...attestorsPublicKey,
      btc.OP.CHECKSIGADD,
      btc.OP.OP_2,
      btc.OP.EQUAL,
    ]);

    const taprootTree = btc.taprootListToTree([
      {
        script: timeoutScript,
        leafVersion: 0xc0,
      },
      {
        script: hashScript,
        leafVersion: 0xc0,
      },
    ]);

    return taprootTree;
  }

  function createAddresses(
    userPublicKey: Uint8Array,
    attestorPublicKey: Uint8Array,
    btcNetwork: BitcoinNetwork,
    taprootTree: btc.TaprootScriptTree
  ): {
    htlcAddress: string;
    htlcTransaction: btc.P2TROut;
    multisigTransaction: btc.P2TROut;
    multisigAddress: string;
  } {
    const htlcTransaction = btc.p2tr(undefined, taprootTree, btcNetwork, true);
    const htlcAddress = htlcTransaction.address;

    const multisig = btc.p2tr_ns(2, [userPublicKey, attestorPublicKey]);
    const multisigTransaction = btc.p2tr(undefined, multisig, btcNetwork);
    const multisigAddress = multisigTransaction.address;

    if (!htlcAddress) throw new BitcoinError('Could not create HTLC address');
    if (!multisigAddress) throw new BitcoinError('Could not create multisig address');

    return { htlcAddress, htlcTransaction, multisigTransaction, multisigAddress };
  }

  function createPrefundingTransaction(
    utxos: any[],
    htlcAddress: string,
    userChangeAddress: string,
    btcAmount: number,
    btcNetwork: BitcoinNetwork
  ) {
    console.log('prefundingTransaction');
    console.log('utxos', utxos);
    console.log('htlcAddress', htlcAddress);
    console.log('userChangeAddress', userChangeAddress);
    console.log('btcAmount', btcAmount);
    console.log('btcNetwork', btcNetwork);
    const outputs = [
      { address: htlcAddress, amount: BigInt(btcAmount) }, // amount in satoshi
    ];

    const selected = btc.selectUTXO(utxos, outputs, 'default', {
      changeAddress: userChangeAddress, // required, address to send change
      feePerByte: 2n, // require, fee per vbyte in satoshi
      bip69: false, // ?? // lexicographical Indexing of Transaction Inputs and Outputs
      createTx: true, // create tx with selected inputs/outputs
      network: btcNetwork,
    });
    console.log('selected', selected);

    const prefundingTransaction = selected?.tx;

    return prefundingTransaction?.toPSBT();
  }

  function createFundingTransaction(
    prefundingTransaction: any,
    htlcTransaction: any,
    btcAmount: number,
    multisigAddress: string,
    btcNetwork: BitcoinNetwork
  ): Uint8Array {
    const fundingTX = new btc.Transaction();
    const prefundingInput = {
      txid: hexToBytes(prefundingTransaction.id),
      index: 0,
      witnessUtxo: { amount: BigInt(btcAmount), script: htlcTransaction.script },
      ...htlcTransaction,
    };
    fundingTX.addInput(prefundingInput);
    fundingTX.addOutputAddress(multisigAddress, BigInt(btcAmount), btcNetwork);
    const fundingPSBT = fundingTX.toPSBT();
    console.log(fundingPSBT);
    return fundingPSBT;
  }

  function createClosingTransaction(
    fundingTransaction: any,
    multisigTransaction: any,
    userAddress: string,
    btcAmount: number,
    btcNetwork: BitcoinNetwork
  ): Uint8Array {
    console.log('closingTransaction');
    const sha256x2 = (...msgs) => sha256(sha256(concatBytes(...msgs)));
    const fundingTransactionID = hex.encode(sha256x2(fundingTransaction).reverse());

    const closingTransaction = new btc.Transaction();
    const fundingInput = {
      txid: hexToBytes(fundingTransactionID),
      index: 0,
      witnessUtxo: { amount: BigInt(btcAmount), script: multisigTransaction.script },
      ...multisigTransaction,
    };
    closingTransaction.addInput(fundingInput);
    closingTransaction.addOutputAddress(userAddress, BigInt(btcAmount), btcNetwork);
    const closingPSBT = closingTransaction.toPSBT();
    return closingPSBT;
  }

  async function signPSBT(psbt: Uint8Array, shouldBroadcast: boolean): Promise<string> {
    const requestParams: SignPsbtRequestParams = {
      hex: bytesToHex(psbt),
      signAtIndex: [0],
      broadcast: shouldBroadcast,
    };
    const result = await window.btc.request('signPsbt', requestParams);
    return result.result.hex;
  }

  async function handlePrefundingTransaction(
    userUTXOs: any[],
    htlcAddress: string,
    userChangeAddress: string,
    btcAmount: number,
    btcNetwork: BitcoinNetwork
  ): Promise<btc.Transaction> {
    const prefundingTransactionPSBT = createPrefundingTransaction(
      userUTXOs,
      htlcAddress,
      userChangeAddress,
      btcAmount,
      btcNetwork
    );
    if (!prefundingTransactionPSBT)
      throw new BitcoinError('Could not create prefunding transaction');
    const prefundingTransactionHex = await signPSBT(prefundingTransactionPSBT, true);
    const prefundingTransactionBytes = hexToBytes(prefundingTransactionHex);
    const prefundingTransaction = btc.Transaction.fromPSBT(prefundingTransactionBytes);
    prefundingTransaction.finalize();
    return prefundingTransaction;
  }

  async function handleFundingTransaction(
    prefundingTransaction: any,
    htlcTransaction: any,
    btcAmount: number,
    multisigAddress: string,
    btcNetwork: BitcoinNetwork
  ): Promise<{ fundingTransaction: Uint8Array; fundingTransactionHex: string }> {
    const fundingTransaction = createFundingTransaction(
      prefundingTransaction,
      htlcTransaction,
      btcAmount,
      multisigAddress,
      btcNetwork
    );
    const fundingTransactionHex = await signPSBT(fundingTransaction, false);
    return { fundingTransaction, fundingTransactionHex };
  }

  async function handleClosingTransaction(
    fundingTransaction: any,
    multisigTransaction: any,
    userAddress: string,
    btcAmount: number,
    btcNetwork: BitcoinNetwork
  ): Promise<string> {
    const closingTransaction = createClosingTransaction(
      fundingTransaction,
      multisigTransaction,
      userAddress,
      btcAmount,
      btcNetwork
    );
    const closingTransactionHex = await signPSBT(closingTransaction, false);
    return closingTransactionHex;
  }

  async function test(): Promise<void> {
    const btcNetwork = regtest;
    const testBitcoinAmount = 50_000;

    const userAddresses = await getBitcoinAddresses();
    const userNativeSegwitAddress = userAddresses[0] as BitcoinNativeSegwitAddress;
    const userTaprootAddress = userAddresses[1] as BitcoinTaprootAddress;
    const userPublicKey = userTaprootAddress.tweakedPublicKey;
    const userTimeoutPublicKey = hex.decode(
      '5e2aaec4656d843798597c5b08876271fa1aae4f0d32a44240d379b75d3aa4fb'
    );

    const attestorPublicKey = 'a27d8d7e1976c7ffaea08ead4aec592da663bcdda75d49ff4bf92dfcb508476e';

    const preImage = hexToBytes('107661134f21fc7c02223d50ab9eb3600bc3ffc3712423a1e47bb1f9a9dbf55f');
    const preImageHash = hexToBytes(
      '6c60f404f8167a38fc70eaf8aa17ac351023bef86bcb9d1086a19afe95bd5333'
    );

    const userUTXOs = await gatherUTXOs(userAddresses[0] as BitcoinNativeSegwitAddress);
    const taprootTree = createTaprootTree(
      userTimeoutPublicKey,
      hex.decode(userPublicKey),
      hex.decode(attestorPublicKey),
      preImageHash
    );
    const { htlcAddress, htlcTransaction, multisigTransaction, multisigAddress } = createAddresses(
      hex.decode(userPublicKey),
      hex.decode(attestorPublicKey),
      btcNetwork,
      taprootTree
    );
    const prefundingTransaction = await handlePrefundingTransaction(
      userUTXOs,
      htlcAddress,
      'bcrt1qk5q0takwdva20adgw8zf4vy07w9529gpfkrv6v',
      testBitcoinAmount,
      btcNetwork
    );

    const { fundingTransaction, fundingTransactionHex } = await handleFundingTransaction(
      prefundingTransaction,
      htlcTransaction,
      testBitcoinAmount,
      multisigAddress,
      btcNetwork
    );
    console.log('fundingTransactionHex', fundingTransactionHex);

    const closingTransactionHex = await handleClosingTransaction(
      fundingTransaction,
      multisigTransaction,
      userNativeSegwitAddress.address,
      testBitcoinAmount,
      btcNetwork
    );
    console.log('closingTransactionHex', closingTransactionHex);
  }

  async function fetchBitcoinPrice() {
    try {
      const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json', {
        headers: { Accept: 'application/json' },
      });
      const message = await response.json();
      const bitcoinUSDPrice = message.bpi.USD.rate_float;
      setBitcoinPrice(bitcoinUSDPrice);
    } catch (error: any) {
      throw new BitcoinError(`Could not fetch bitcoin price: ${error.message}`);
    }
  }

  return {
    test,
    bitcoinPrice,
  };
}
