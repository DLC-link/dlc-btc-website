import {
  calculatePoints,
  calculateRewardBetweenEvents,
  calculateRollingTVL,
} from '@hooks/use-points';
import { DetailedEvent, TimeStampedEvent } from '@models/ethereum-models';
import { describe, expect, it } from 'vitest';

const BURN_ADDRESS = '0x0000000000000000000000000000000000000000';
const USER_ADDRESS = '0x123';
const OTHER_EOA = '0x456';

describe('calculateRollingTVL', () => {
  it('should correctly calculate total value locked over time', () => {
    const events: DetailedEvent[] = [
      { from: BURN_ADDRESS, to: USER_ADDRESS, value: 50000000, timestamp: 1000, txHash: '0x' },
      { from: USER_ADDRESS, to: BURN_ADDRESS, value: 1000000, timestamp: 2000, txHash: '0x' },
      { from: USER_ADDRESS, to: OTHER_EOA, value: 200000, timestamp: 3000, txHash: '0x' },
      { from: BURN_ADDRESS, to: USER_ADDRESS, value: 1000000, timestamp: 4000, txHash: '0x' },
    ];

    const result = calculateRollingTVL(events, USER_ADDRESS);

    expect(result).toEqual([
      { timestamp: 1000, amount: 50000000, totalValueLocked: 50000000 },
      { timestamp: 2000, amount: -1000000, totalValueLocked: 50000000 - 1000000 },
      { timestamp: 3000, amount: -200000, totalValueLocked: 50000000 - 1000000 - 200000 },
      { timestamp: 4000, amount: 1000000, totalValueLocked: 50000000 - 1000000 - 200000 + 1000000 },
    ]);
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

  it('should return correct value if there is only one event', () => {
    const events: TimeStampedEvent[] = [
      { timestamp: 1000, amount: 50000000, totalValueLocked: 50000000 },
    ];
    const rewardsRate = 0.01;

    const result = calculatePoints(events, rewardsRate);

    expect(result).not.toEqual(0);
  });
});
