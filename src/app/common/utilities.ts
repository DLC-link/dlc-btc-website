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

export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
