interface TransactionStatus {
  confirmed: boolean;
  block_height: number;
  block_hash: string;
  block_time: number;
}

export interface BitcoinInputSigningConfig {
  derivationPath: string;
  index: number;
}

export type PaymentTypes = 'p2pkh' | 'p2sh' | 'p2wpkh-p2sh' | 'p2wpkh' | 'p2tr';

export interface FeeRates {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}

interface BitcoinTransactionIssuance {
  asset_id: string;
  is_reissuance: boolean;
  asset_blinding_nonce: number;
  asset_entropy: number;
  contract_hash: string;
  assetamount?: number;
  assetamountcommitment?: number;
  tokenamount?: number;
  tokenamountcommitment?: number;
}

interface BitcoinTransactionPegOut {
  genesis_hash: string;
  scriptpubkey: string;
  scriptpubkey_asm: string;
  scriptpubkey_address: string;
}

interface BitcoinTransactionStatus {
  confirmed: boolean;
  block_height?: number | null;
  block_hash?: string | null;
  block_time?: number | null;
}

export interface BitcoinTransactionVectorOutput {
  scriptpubkey: string;
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  scriptpubkey_address: string;
  value: number;
  valuecommitment?: number;
  asset?: string;
  assetcommitment?: number;
  pegout?: BitcoinTransactionPegOut | null;
}

interface BitcoinTransactionVectorInput {
  inner_redeemscript_asm?: string;
  inner_witnessscript_asm?: string;
  is_coinbase: boolean;
  is_pegin?: boolean;
  issuance?: BitcoinTransactionIssuance | null;
  prevout: BitcoinTransactionVectorOutput;
  scriptsig: string;
  scriptsig_asm: string;
  sequence: number;
  txid: string;
  vout: number;
  witness: string[];
}

export interface BitcoinTransaction {
  fee: number;
  locktime: number;
  size: number;
  status: BitcoinTransactionStatus;
  tx_type?: string;
  txid: string;
  version: number;
  vin: BitcoinTransactionVectorInput[];
  vout: BitcoinTransactionVectorOutput[];
  weight: number;
}

interface TransactionStatus {
  confirmed: boolean;
  block_height: number;
  block_hash: string;
  block_time: number;
}

export interface UTXO {
  txid: string;
  vout: number;
  status: TransactionStatus;
  value: number;
}
