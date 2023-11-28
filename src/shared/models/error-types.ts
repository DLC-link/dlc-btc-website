export class BitcoinError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BitcoinError";
  }
}

export class EthereumError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EthereumError";
  }
}
