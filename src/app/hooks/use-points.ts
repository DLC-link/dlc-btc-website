import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { DetailedEvent, TimeStampedEvent } from '@models/ethereum-models';
import Decimal from 'decimal.js';

import { BURN_ADDRESS } from '@shared/constants/ethereum.constants';

import { RootState } from '../store';
import { useEthereum } from './use-ethereum';

interface UsePointsReturnType {
  userPoints: number | undefined;
}

export function calculateRollingTVL(events: DetailedEvent[]): TimeStampedEvent[] {
  return events.reduce<TimeStampedEvent[]>((rollingTVL, { from, to, value, timestamp }) => {
    if (from !== BURN_ADDRESS && to !== BURN_ADDRESS) {
      throw new Error('Invalid event in calculateRollingTVL');
    }
    const currentTotalValueLocked =
      rollingTVL.length > 0 ? rollingTVL[rollingTVL.length - 1].totalValueLocked : 0;
    const amount = to === BURN_ADDRESS ? -value.toNumber() : value.toNumber();

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

export function usePoints(): UsePointsReturnType {
  const { address: userAddress } = useSelector((state: RootState) => state.account);
  const { fetchMintBurnEvents } = useEthereum();

  const [userPoints, setUserPoints] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchUserPoints = async (currentUserAddress: string) => {
      void fetchPoints(currentUserAddress);
    };
    if (userAddress) {
      void fetchUserPoints(userAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]);

  async function fetchPoints(currentUserAddress: string): Promise<void> {
    const rewardsRate = import.meta.env.VITE_REWARDS_RATE;
    if (!rewardsRate) {
      throw new Error('Rewards Rate not set');
    }
    const events = await fetchMintBurnEvents(currentUserAddress);
    events.sort((a, b) => a.timestamp - b.timestamp);
    const rollingTVL = calculateRollingTVL(events);
    setUserPoints(calculatePoints(rollingTVL, rewardsRate));
  }

  return {
    userPoints,
  };
}
