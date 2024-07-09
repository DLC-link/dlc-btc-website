import { DetailedEvent, TimeStampedEvent } from '@models/ethereum-models';
import Decimal from 'decimal.js';

import { BURN_ADDRESS } from '@shared/constants/ethereum.constants';

export function calculateRollingTVL(events: DetailedEvent[]): TimeStampedEvent[] {
  return events.reduce<TimeStampedEvent[]>((rollingTVL, { from, to, value, timestamp }) => {
    if (from !== BURN_ADDRESS && to !== BURN_ADDRESS) {
      throw new Error('Invalid event in calculateRollingTVL');
    }
    const currentTotalValueLocked =
      rollingTVL.length > 0 ? rollingTVL[rollingTVL.length - 1].totalValueLocked : 0;
    const amount = to === BURN_ADDRESS ? -value : value;

    rollingTVL.push({
      timestamp,
      amount,
      totalValueLocked: currentTotalValueLocked + amount,
    });

    return rollingTVL;
  }, []);
}

export function calculateRewardBetweenEvents(
  previousEvent: TimeStampedEvent,
  currentEvent: TimeStampedEvent,
  rewardsRate: number
): number {
  const rewardsPerTime = new Decimal(previousEvent.totalValueLocked).times(rewardsRate);
  const rewards = rewardsPerTime.times(
    new Decimal(currentEvent.timestamp).minus(previousEvent.timestamp)
  );
  return rewards.toNumber();
}

export function calculatePoints(
  userTimeStampedEvents: TimeStampedEvent[],
  rewardsRate: number
): number {
  if (userTimeStampedEvents.length === 0) {
    return 0;
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const totalRewards = userTimeStampedEvents.reduce((acc, currentEvent, index, array) => {
    if (index === 0) {
      return acc;
    }
    const previousEvent = array[index - 1];
    acc += calculateRewardBetweenEvents(previousEvent, currentEvent, rewardsRate);
    if (index === array.length - 1) {
      acc += calculateRewardBetweenEvents(
        currentEvent,
        {
          timestamp: currentTimestamp,
          totalValueLocked: currentEvent.totalValueLocked,
          amount: 0,
        },
        rewardsRate
      );
    }
    return acc;
  }, 0);

  return totalRewards;
}
