export class BitcoinError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BitcoinError';
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
