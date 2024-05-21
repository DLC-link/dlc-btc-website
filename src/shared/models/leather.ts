export interface BitcoinNativeSegwitAddress {
  address: string;
  derivationPath: string;
  publicKey: string;
  symbol: string;
  type: string;
}

export interface BitcoinTaprootAddress extends BitcoinNativeSegwitAddress {
  type: 'p2tr';
  tweakedPublicKey: string;
}

interface StacksAddress {
  address: string;
  symbol: string;
}

export type Address = BitcoinNativeSegwitAddress | BitcoinTaprootAddress | StacksAddress;

interface RpcResult {
  addresses: Address[];
}

export interface RpcResponse {
  id: string;
  jsonrpc: string;
  result: RpcResult;
}

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
export interface SignPsbtRequestParams {
  hex: string;
  allowedSighash?: SignatureHash[];
  signAtIndex?: number | number[]; // default is all inputs
  network?: NetworkModes; // default is user's current network
  account?: number; // default is user's current account
  broadcast?: boolean; // default is false - finalize/broadcast tx
}
