export class BitcoinError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BitcoinError';
  }
}

export class EthereumError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EthereumError';
  }
}

export class AttestorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AttestorError';
  }
}

export class LedgerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LedgerError';
  }
}

export class LeatherError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LeatherError';
  }
}
