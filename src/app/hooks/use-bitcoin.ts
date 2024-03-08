import { useEffect, useState } from 'react';

import { BitcoinNetwork, regtest } from '@models/bitcoin-network';
import { BitcoinError } from '@models/error-types';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { hex } from '@scure/base';
import * as btc from '@scure/btc-signer';

import { useEndpoints } from './use-endpoints';

const networkModes = ['mainnet', 'testnet'] as const;

type NetworkModes = (typeof networkModes)[number];

// type BitcoinTestnetModes = 'testnet' | 'regtest' | 'signet';

// type BitcoinNetworkModes = NetworkModes | BitcoinTestnetModes;

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
  signAndBroadcastFundingPSBT: (btcAmount: number) => Promise<{
    fundingTransactionID: string;
    multisigTransaction: btc.P2TROut;
    userNativeSegwitAddress: string;
    btcAmount: number;
  }>;
  signClosingPSBT: (
    fundingTransactionID: string,
    multisigTransaction: btc.P2TROut,
    uuid: string,
    userNativeSegwitAddress: string,
    btcAmount: number
  ) => Promise<void>;
  bitcoinPrice: number;
}

export function useBitcoin(): UseBitcoinReturnType {
  const { attestorAPIURL, bitcoinBlockchainAPIURL } = useEndpoints();
  const [bitcoinPrice, setBitcoinPrice] = useState(0);
  const [btcNetwork, setBTCNetwork] = useState<BitcoinNetwork>(regtest);

  useEffect(() => {
    const getBitcoinPrice = async () => {
      await fetchBitcoinPrice();
    };
    getBitcoinPrice();
  }, []);

  async function getBitcoinAddresses(): Promise<Address[]> {
    try {
      const rpcResponse: RpcResponse = await window.btc?.request('getAddresses');
      const userAddresses = rpcResponse.result.addresses;
      return userAddresses;
    } catch (error) {
      throw new BitcoinError(`Error getting bitcoin addresses: ${error}`);
    }
  }

  async function gatherUTXOs(bitcoinNativeSegwitAddress: BitcoinNativeSegwitAddress): Promise<any> {
    const response = await fetch(
      `${bitcoinBlockchainAPIURL}/address/${bitcoinNativeSegwitAddress.address}/utxo`
    );
    const allUTXOs = await response.json();
    const userPublicKey = hexToBytes(bitcoinNativeSegwitAddress.publicKey);
    const spend = btc.p2wpkh(userPublicKey, regtest);

    const utxos = await Promise.all(
      allUTXOs.map(async (utxo: UTXO) => {
        const txHex = await (await fetch(`${bitcoinBlockchainAPIURL}/tx/${utxo.txid}/hex`)).text();
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
  }

  async function getAttestorPublicKey(): Promise<string> {
    const attestorGetGroupPublicKeyURL = `${attestorAPIURL}/get-group-publickey`;

    try {
      const response = await fetch(attestorGetGroupPublicKeyURL);
      const attestorGroupPublicKey = await response.text();

      return attestorGroupPublicKey;
    } catch (error) {
      throw new BitcoinError(`Error getting attestor public key: ${error}`);
    }
  }

  function createMultisigTransactionAndAddress(
    userPublicKey: Uint8Array,
    attestorPublicKey: Uint8Array,
    btcNetwork: BitcoinNetwork
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

  async function sendPSBT(
    closingPSBT: string,
    uuid: string,
    userNativeSegwitAddress: string
  ): Promise<void> {
    setBTCNetwork(regtest);
    const attestorAPIURLs = [
      'http://localhost:8811/create-psbt-event',
      'http://localhost:8812/create-psbt-event',
      'http://localhost:8813/create-psbt-event',
    ];

    const requests = attestorAPIURLs.map(async url => {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          uuid,
          closing_psbt: closingPSBT,
          mint_address: userNativeSegwitAddress,
          chain: 'evm-sepolia',
        }),
      });
    });
    const results = await Promise.all(requests);
    console.log('results', results);
  }
  async function createClosingTransaction(
    fundingTransactionID: string,
    multisigTransaction: any,
    userNativeSegwitAddress: string,
    btcAmount: number,
    btcNetwork: BitcoinNetwork
  ): Promise<Uint8Array> {
    const closingTransaction = new btc.Transaction({ PSBTVersion: 0 });
    const fundingInput = {
      txid: hexToBytes(fundingTransactionID),
      index: 0,
      witnessUtxo: { amount: BigInt(btcAmount), script: multisigTransaction.script },
      ...multisigTransaction,
    };
    closingTransaction.addInput(fundingInput);
    closingTransaction.addOutputAddress(
      userNativeSegwitAddress,
      BigInt(btcAmount - 10000),
      btcNetwork
    );
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
  ): Promise<{ fundingTransactionHex: string; fundingTransactionID: string }> {
    const fundingTransaction = createFundingTransaction(
      multisigAddress,
      userChangeAddress,
      utxos,
      btcAmount,
      btcNetwork
    );
    const fundingTransactionHex = await signPSBT(fundingTransaction, false);
    const transaction = btc.Transaction.fromPSBT(hexToBytes(fundingTransactionHex));
    transaction.finalize();

    let fundingTransactionID = '';
    await fetch(`${bitcoinBlockchainAPIURL}/tx`, {
      method: 'POST',
      body: bytesToHex(transaction.extract()),
    }).then(async response => {
      fundingTransactionID = await response.text();
    });
    return { fundingTransactionHex, fundingTransactionID };
  }

  async function handleClosingTransaction(
    fundingTransactionID: string,
    multisigTransaction: btc.P2TROut,
    userAddress: string,
    uuid: string,
    btcAmount: number,
    btcNetwork: BitcoinNetwork
  ): Promise<string> {
    const closingTransaction = await createClosingTransaction(
      fundingTransactionID,
      multisigTransaction,
      userAddress,
      btcAmount,
      btcNetwork
    );
    const closingTransactionHex = await signPSBT(closingTransaction, false);

    await sendPSBT(closingTransactionHex, uuid, userAddress);
    return closingTransactionHex;
  }

  async function signAndBroadcastFundingPSBT(btcAmount: number): Promise<{
    fundingTransactionID: string;
    multisigTransaction: btc.P2TROut;
    userNativeSegwitAddress: string;
    btcAmount: number;
  }> {
    const userAddresses = await getBitcoinAddresses();
    const userNativeSegwitAccount = userAddresses[0] as BitcoinNativeSegwitAddress;
    const userNativeSegwitAddress = userNativeSegwitAccount.address;
    const userTaprootAddress = userAddresses[1] as BitcoinTaprootAddress;
    const userPublicKey = userTaprootAddress.tweakedPublicKey;

    const attestorPublicKey = await getAttestorPublicKey();

    const userUTXOs = await gatherUTXOs(userAddresses[0] as BitcoinNativeSegwitAddress);
    const { multisigTransaction, multisigAddress } = createMultisigTransactionAndAddress(
      hex.decode(userPublicKey),
      hex.decode(attestorPublicKey),
      btcNetwork
    );

    const { fundingTransactionHex, fundingTransactionID } = await handleFundingTransaction(
      multisigAddress,
      userNativeSegwitAddress,
      userUTXOs,
      btcAmount,
      btcNetwork
    );
    console.log('fundingTransactionHex', fundingTransactionHex);

    return { fundingTransactionID, multisigTransaction, userNativeSegwitAddress, btcAmount };
  }

  async function signClosingPSBT(
    fundingTransactionID: string,
    multisigTransaction: btc.P2TROut,
    uuid: string,
    userNativeSegwitAddress: string,
    btcAmount: number
  ): Promise<void> {
    if (!fundingTransactionID || !multisigTransaction || !userNativeSegwitAddress || !btcAmount) {
      throw new BitcoinError('Missing parameters to sign closing PSBT');
    }
    await handleClosingTransaction(
      fundingTransactionID,
      multisigTransaction,
      userNativeSegwitAddress,
      uuid,
      btcAmount,
      btcNetwork
    );
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
    signAndBroadcastFundingPSBT,
    signClosingPSBT,
    bitcoinPrice,
  };
}
