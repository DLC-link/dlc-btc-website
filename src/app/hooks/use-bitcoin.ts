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
  lockBitcoin: (btcAmount: number) => Promise<void>;
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
    const rpcResponse: RpcResponse = await window.btc?.request('getAddresses');
    const userAddresses = rpcResponse.result.addresses;
    return userAddresses;
  }

  async function gatherUTXOs(bitcoinNativeSegwitAddress: BitcoinNativeSegwitAddress): Promise<any> {
    const response = await fetch(
      `${ELECTRUM_API_URL}/address/${bitcoinNativeSegwitAddress.address}/utxo`
    );
    const allUTXOs = await response.json();
    const userPublicKey = hexToBytes(bitcoinNativeSegwitAddress.publicKey);
    const spend = btc.p2wpkh(userPublicKey, regtest);

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

  function createMultisigTransactionAndAddress(
    userPublicKey: Uint8Array,
    attestorPublicKey: Uint8Array,
    btcNetwork: BitcoinNetwork,
  ): {
    multisigTransaction: btc.P2TROut;
    multisigAddress: string;
  } {
    const multisig = btc.p2tr_ns(2, [userPublicKey, attestorPublicKey]);
    const multisigTransaction = btc.p2tr(undefined, multisig, btcNetwork);
    const multisigAddress = multisigTransaction.address;

    if (!multisigAddress) throw new BitcoinError('Could not create multisig address');

    return { multisigTransaction, multisigAddress };
  }

  function createFundingTransaction(
    multisigAddress: string,
    userChangeAddress: string,
    utxos: any[],
    btcAmount: number,
    btcNetwork: BitcoinNetwork
  ): Uint8Array {
    const outputs = [
      { address: multisigAddress, amount: BigInt(btcAmount) }, // amount in satoshi
    ];

    const selected = btc.selectUTXO(utxos, outputs, 'default', {
      changeAddress: userChangeAddress, // required, address to send change
      feePerByte: 2n, // require, fee per vbyte in satoshi
      bip69: false, // ?? // lexicographical Indexing of Transaction Inputs and Outputs
      createTx: true, // create tx with selected inputs/outputs
      network: btcNetwork,
    });

    const fundingTX = selected?.tx;

    if (!fundingTX) throw new BitcoinError('Could not create funding transaction');

    const fundingPSBT = fundingTX.toPSBT();
    return fundingPSBT;
  }

  function getFundingTransactionID(fundingTransaction: Uint8Array): string {
    const sha256x2 = (...msgs: Uint8Array[]) => sha256(sha256(concatBytes(...msgs)));
    const fundingTransactionID = hex.encode(sha256x2(fundingTransaction).reverse());
    return fundingTransactionID;
  }

  function createClosingTransaction(
    fundingTransactionID: string,
    multisigTransaction: any,
    userNativeSegwitAddress: string,
    btcAmount: number,
    btcNetwork: BitcoinNetwork
  ): Uint8Array {
    const closingTransaction = new btc.Transaction();
    const fundingInput = {
      txid: hexToBytes(fundingTransactionID),
      index: 0,
      witnessUtxo: { amount: BigInt(btcAmount), script: multisigTransaction.script },
      ...multisigTransaction,
    };
    closingTransaction.addInput(fundingInput);
    closingTransaction.addOutputAddress(userNativeSegwitAddress, BigInt(btcAmount), btcNetwork);
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


  async function handleFundingTransaction(
multisigAddress: string,
userChangeAddress: string,
utxos: any[],
    btcAmount: number,
    btcNetwork: BitcoinNetwork
  ): Promise<{ fundingTransaction: Uint8Array; fundingTransactionHex: string }> {
    const fundingTransaction = createFundingTransaction(
      multisigAddress,
      userChangeAddress,
      utxos,
      btcAmount,
      btcNetwork
    );
    const fundingTransactionHex = await signPSBT(fundingTransaction, true);
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

  async function lockBitcoin(btcAmount: number): Promise<void> {
    const btcNetwork = regtest;

    const userAddresses = await getBitcoinAddresses();
    const userNativeSegwitAddress = userAddresses[0] as BitcoinNativeSegwitAddress;
    const userTaprootAddress = userAddresses[1] as BitcoinTaprootAddress;
    const userPublicKey = userTaprootAddress.tweakedPublicKey;

    const attestorPublicKey = 'a27d8d7e1976c7ffaea08ead4aec592da663bcdda75d49ff4bf92dfcb508476e';

    // const preImage = hexToBytes('107661134f21fc7c02223d50ab9eb3600bc3ffc3712423a1e47bb1f9a9dbf55f');
    // const preImageHash = hexToBytes(
    //   '6c60f404f8167a38fc70eaf8aa17ac351023bef86bcb9d1086a19afe95bd5333'
    // );

    const userUTXOs = await gatherUTXOs(userAddresses[0] as BitcoinNativeSegwitAddress);
    const { multisigTransaction, multisigAddress } = createMultisigTransactionAndAddress(
      hex.decode(userPublicKey),
      hex.decode(attestorPublicKey),
      btcNetwork,
    );

    const { fundingTransaction, fundingTransactionHex } = await handleFundingTransaction(
      multisigAddress,
      userNativeSegwitAddress.address,
      userUTXOs,
      btcAmount,
      btcNetwork
    );
    console.log('fundingTransactionHex', fundingTransactionHex);

    const fundingTransactionID = getFundingTransactionID(fundingTransaction);

    const closingTransactionHex = await handleClosingTransaction(
      fundingTransactionID,
      multisigTransaction,
      userNativeSegwitAddress.address,
      btcAmount,
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
    lockBitcoin,
    bitcoinPrice,
  };
}
