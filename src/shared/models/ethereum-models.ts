import { BigNumber } from 'ethers';

export interface TimeStampedEvent {
  timestamp: number;
  amount: number;
  totalValueLocked: number;
}

export interface RollingTVLMap {
  [address: string]: TimeStampedEvent[];
}

export interface Rewards {
  [address: string]: number;
}

export interface DetailedEvent {
  from: string;
  to: string;
  value: BigNumber;
  timestamp: number;
}
