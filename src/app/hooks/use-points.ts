import { useContext } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { DetailedEvent, TimeStampedEvent } from '@models/ethereum-models';
import { EthereumHandlerContext } from '@providers/ethereum-handler-context-provider';
import Decimal from 'decimal.js';
import { Event, ethers } from 'ethers';

import { RootState } from '../store';

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
  const { userPointsContractReader } = useContext(EthereumHandlerContext);

  const { data: userPoints } = useQuery(
    ['userPoints', userAddress], // Unique key for the query, including the userAddress to refetch when it changes
    () => fetchPoints(userPointsContractReader!, userAddress!), // Fetch function, using non-null assertion because we check for existence in `enabled`
    {
      enabled: !!userAddress && !!userPointsContractReader, // Only run the query if userAddress is not undefined or empty
    }
  );

  function formatTransferEvent(event: any, timestamp: number): DetailedEvent {
    return {
      from: event.from.toLowerCase(),
      to: event.to.toLowerCase(),
      value: event.value,
      timestamp,
    };
  }

  async function fetchTransferEvents(
    userPointsContractReader: ethers.Contract,
    userAddress: string
  ): Promise<DetailedEvent[]> {
    if (!userPointsContractReader) {
      throw new Error('Points Contract Reader is not set');
    }
    const eventFilterTo = userPointsContractReader.filters.Transfer(BURN_ADDRESS, userAddress);
    const eventFilterFrom = userPointsContractReader.filters.Transfer(userAddress, BURN_ADDRESS);
    const eventsTo = await userPointsContractReader.queryFilter(eventFilterTo);
    const eventsFrom = await userPointsContractReader.queryFilter(eventFilterFrom);
    const events = [...eventsTo, ...eventsFrom];
    const detailedEvents: DetailedEvent[] = [];

    await Promise.all(
      events.map(async (event: Event) => {
        const block = await userPointsContractReader.provider.getBlock(event.blockNumber);
        detailedEvents.push(formatTransferEvent(event.args, block.timestamp));
      })
    );

    detailedEvents.sort((a, b) => a.timestamp - b.timestamp);

    return detailedEvents;
  }

  async function fetchPoints(
    userPointsContractReader: ethers.Contract,
    currentUserAddress: string
  ): Promise<number> {
    const rewardsRate = import.meta.env.VITE_REWARDS_RATE;
    if (!rewardsRate) {
      throw new Error('Rewards Rate not set');
    }
    const events = await fetchTransferEvents(userPointsContractReader, currentUserAddress);
    const rollingTVL = calculateRollingTVL(events);
    return calculatePoints(rollingTVL, rewardsRate);
  }

  return {
    userPoints,
  };
}
