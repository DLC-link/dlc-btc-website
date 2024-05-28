import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { DetailedEvent, TimeStampedEvent } from '@models/ethereum-models';
import { Event } from 'ethers';

import { RootState } from '../store';
import { useEthereum } from './use-ethereum';

const BURN_ADDRESS = '0x0000000000000000000000000000000000000000';

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
  const rewardsPerTime = previousEvent.totalValueLocked * rewardsRate;
  const rewards = rewardsPerTime * (currentEvent.timestamp - previousEvent.timestamp);
  return rewards;
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
  const { address: userAddress, network } = useSelector((state: RootState) => state.account);
  const { getDefaultProvider } = useEthereum();

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

  function formatTransferEvent(event: any, timestamp: number): DetailedEvent {
    return {
      from: event.from.toLowerCase(),
      to: event.to.toLowerCase(),
      value: event.value,
      timestamp,
    };
  }

  async function fetchTransferEvents(userAddress: string): Promise<DetailedEvent[]> {
    const dlcBTCContract = await getDefaultProvider(network, 'DLCBTC');
    const eventFilterTo = dlcBTCContract.filters.Transfer(null, userAddress);
    const eventFilterFrom = dlcBTCContract.filters.Transfer(userAddress, null);
    const eventsTo = await dlcBTCContract.queryFilter(eventFilterTo);
    const eventsFrom = await dlcBTCContract.queryFilter(eventFilterFrom);
    const events = [...eventsTo, ...eventsFrom];
    const detailedEvents: DetailedEvent[] = [];

    await Promise.all(
      events.map(async (event: Event) => {
        const block = await dlcBTCContract.provider.getBlock(event.blockNumber);
        detailedEvents.push(formatTransferEvent(event.args, block.timestamp));
      })
    );

    detailedEvents.sort((a, b) => a.timestamp - b.timestamp);

    return detailedEvents;
  }

  async function fetchPoints(currentUserAddress: string): Promise<void> {
    const rewardsRate = import.meta.env.VITE_REWARDS_RATE;
    const events = await fetchTransferEvents(currentUserAddress);
    const rollingTVL = calculateRollingTVL(events);
    setUserPoints(calculatePoints(rollingTVL, rewardsRate));
  }

  return {
    userPoints,
  };
}
