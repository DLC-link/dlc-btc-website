import Decimal from 'decimal.js';

export function formatNumber(value: number): string {
  if (value < 10000) {
    return value.toString();
  } else if (value < 1000000) {
    return new Decimal(value).dividedBy(1000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else if (value < 1000000000) {
    return new Decimal(value).dividedBy(1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (value < 1000000000000) {
    return new Decimal(value).dividedBy(1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  } else {
    return new Decimal(value).dividedBy(1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
  }
}
