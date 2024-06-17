import Decimal from 'decimal.js';

export function easyTruncateAddress(address: string): string {
  const truncationLength = 4;
  const prefix = address.substring(0, truncationLength);
  const suffix = address.substring(address.length - truncationLength);
  return `${prefix}...${suffix}`;
}

export function customShiftValue(value: number, shift: number, unshift: boolean): number {
  const decimalPoweredShift = new Decimal(10 ** shift);
  const decimalValue = new Decimal(Number(value));
  const decimalShiftedValue = unshift
    ? decimalValue.div(decimalPoweredShift).toNumber()
    : decimalValue.mul(decimalPoweredShift).toNumber();

  return decimalShiftedValue;
}

export function unshiftValue(value: number): number {
  const decimalPoweredShift = new Decimal(10 ** 8);
  const decimalValue = new Decimal(Number(value));
  const decimalShiftedValue = decimalValue.div(decimalPoweredShift).toNumber();

  return decimalShiftedValue;
}

export function createRangeFromLength(length: number): number[] {
  return [...Array(length).keys()];
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

export function isDefined<T>(argument: T | undefined): argument is T {
  return !isUndefined(argument);
}

export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function reverseBytes(bytes: Buffer): Buffer;
export function reverseBytes(bytes: Uint8Array): Uint8Array;
export function reverseBytes(bytes: Buffer | Uint8Array): Buffer | Uint8Array {
  if (Buffer.isBuffer(bytes)) return Buffer.from(bytes).reverse();
  return new Uint8Array(bytes.slice().reverse());
}

export function truncateNodeID(nodeID: string): string {
  const start = nodeID.slice(0, 14);
  const end = nodeID.slice(-7);
  return `${start}...${end}`;
} 
