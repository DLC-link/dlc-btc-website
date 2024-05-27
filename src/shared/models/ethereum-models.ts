import { BigNumber } from 'ethers';

export interface TimeStampedEvent {
  timestamp: number;
  amount: number;
  totalValueLocked: number;
}
export interface DetailedEvent {
  from: string;
  to: string;
  value: BigNumber;
  timestamp: number;
}
