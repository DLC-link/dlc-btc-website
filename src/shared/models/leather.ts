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

export interface StacksAddress {
  address: string;
  symbol: string;
}

export type Address = BitcoinNativeSegwitAddress | BitcoinTaprootAddress | StacksAddress;

export interface RpcResult {
  addresses: Address[];
}

export interface RpcResponse {
  id: string;
  jsonrpc: string;
  result: RpcResult;
}
