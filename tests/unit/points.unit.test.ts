import {
  calculatePoints,
  calculateRewardBetweenEvents,
  calculateRollingTVL,
} from '@hooks/use-points';
import { DetailedEvent, TimeStampedEvent } from '@models/ethereum-models';
import { BigNumber } from 'ethers';
import { describe, expect, it } from 'vitest';

const BURN_ADDRESS = '0x0000000000000000000000000000000000000000';
const txHash = '0x456';

describe('calculateRollingTVL', () => {
  it('should correctly calculate total value locked over time', () => {
    const events: DetailedEvent[] = [
      { from: BURN_ADDRESS, to: '0x123', value: BigNumber.from(50000000), timestamp: 1000, txHash: txHash },
      { from: '0x123', to: BURN_ADDRESS, value: BigNumber.from(1000000), timestamp: 2000, txHash: txHash },
      { from: '0x123', to: BURN_ADDRESS, value: BigNumber.from(200000), timestamp: 3000, txHash: txHash },
      { from: BURN_ADDRESS, to: '0x123', value: BigNumber.from(1000000), timestamp: 4000, txHash: txHash },
    ];

    const result = calculateRollingTVL(events);

    expect(result).toEqual([
      { timestamp: 1000, amount: 50000000, totalValueLocked: 50000000 },
      { timestamp: 2000, amount: -1000000, totalValueLocked: 50000000 - 1000000 },
      { timestamp: 3000, amount: -200000, totalValueLocked: 50000000 - 1000000 - 200000 },
      { timestamp: 4000, amount: 1000000, totalValueLocked: 50000000 - 1000000 - 200000 + 1000000 },
    ]);
  });

  it('should throw an error if neither FROM nor TO address is BURN_ADDRESS', () => {
    const events: DetailedEvent[] = [
      { from: '0x123', to: '0x456', value: BigNumber.from(100), timestamp: 1000, txHash: txHash },
    ];

    expect(() => calculateRollingTVL(events)).toThrow('Invalid event in calculateRollingTVL');
  });
});
describe('calculatePoints', () => {
  it('should correctly calculate total rewards', () => {
    const events: TimeStampedEvent[] = [
      { timestamp: 1000, amount: 50000000, totalValueLocked: 50000000 },
      { timestamp: 2000, amount: -1000000, totalValueLocked: 50000000 - 1000000 },
      { timestamp: 3000, amount: 200000, totalValueLocked: 50000000 - 1000000 - 200000 },
    ];
    const rewardsRate = 0.01;

    const result = calculatePoints(events, rewardsRate);

    const expectedRewards = events.reduce((acc, currentEvent, index, array) => {
      if (index === 0) {
        return acc;
      }
      const previousEvent = array[index - 1];
      acc += calculateRewardBetweenEvents(previousEvent, currentEvent, rewardsRate);
      if (index === array.length - 1) {
        acc += calculateRewardBetweenEvents(
          currentEvent,
          {
            timestamp: Math.floor(Date.now() / 1000),
            totalValueLocked: currentEvent.totalValueLocked,
            amount: 0,
          },
          rewardsRate
        );
      }
      return acc;
    }, 0);

    expect(result).toBeCloseTo(expectedRewards);
  });

  it('should return 0 if there are no events', () => {
    const events: TimeStampedEvent[] = [];
    const rewardsRate = 0.01;

    const result = calculatePoints(events, rewardsRate);

    expect(result).toEqual(0);
  });
});
