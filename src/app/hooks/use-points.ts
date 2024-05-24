import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { DetailedEvent, Rewards, RollingTVLMap, TimeStampedEvent } from '@models/ethereum-models';
import { BigNumber, Event } from 'ethers';

import { RootState } from '../store';
import { useEthereum } from './use-ethereum';

const BURN_ADDRESS = '0x0000000000000000000000000000000000000000';

interface UsePointsReturnType {
  userPoints: number | undefined;
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

  async function fetchTransferEvents(): Promise<DetailedEvent[]> {
    const dlcBTCContract = await getDefaultProvider(network, 'DLCBTC');
    const eventFilter = dlcBTCContract.filters.Transfer();
    const events = await dlcBTCContract.queryFilter(eventFilter);
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

  function initializeAddressInMap(address: string, map: RollingTVLMap) {
    if (!(address in map)) {
      map[address] = [];
    }
  }

  function updateTVLMap(
    address: string,
    timestamp: number,
    value: BigNumber,
    map: RollingTVLMap,
    isBurn: boolean
  ) {
    const currentTotalValueLocked =
      map[address].length > 0 ? map[address][map[address].length - 1].totalValueLocked : 0;
    const amount = isBurn ? -value.toNumber() : value.toNumber();
    map[address].push({
      timestamp: timestamp,
      amount: amount,
      totalValueLocked: currentTotalValueLocked + amount,
    });
  }

  function calculateRollingTVL(events: DetailedEvent[]) {
    const rollingTVLMap: RollingTVLMap = {};

    events.forEach(({ from, to, value, timestamp }) => {
      initializeAddressInMap(to, rollingTVLMap);
      initializeAddressInMap(from, rollingTVLMap);

      if (from === BURN_ADDRESS) {
        updateTVLMap(to, timestamp, value, rollingTVLMap, false);
      } else if (to === BURN_ADDRESS) {
        updateTVLMap(from, timestamp, value, rollingTVLMap, true);
      }
    });

    return rollingTVLMap;
  }

  function calculateReward(
    previousEvent: TimeStampedEvent,
    currentEvent: TimeStampedEvent,
    rewardsRate: number
  ) {
    const rewardsPerTime = previousEvent.totalValueLocked * rewardsRate;
    const rewards = rewardsPerTime * (currentEvent.timestamp - previousEvent.timestamp);
    return rewards;
  }

  function calculatePoints(
    rollingTVLMap: RollingTVLMap,
    currentUserAddress: string,
    rewardsRate: number
  ): void {
    const rewards: Rewards = {};
    const currentTimestamp = Math.floor(Date.now() / 1000);

    for (const [address, events] of Object.entries(rollingTVLMap)) {
      let totalRewards = 0;
      for (let i = 1; i < events.length; i++) {
        totalRewards += calculateReward(events[i - 1], events[i], rewardsRate);
      }

      const lastEvent = events[events.length - 1];
      if (lastEvent) {
        totalRewards += calculateReward(
          lastEvent,
          {
            timestamp: currentTimestamp,
            totalValueLocked: lastEvent.totalValueLocked,
            amount: 0,
          },
          rewardsRate
        );
        rewards[address] = totalRewards;
      }
    }

    setUserPoints(rewards[currentUserAddress]);
  }

  async function fetchPoints(currentUserAddress: string): Promise<void> {
    const rewardsRate = import.meta.env.VITE_REWARDS_RATE;
    const events = await fetchTransferEvents();
    const rollingTVL = calculateRollingTVL(events);
    calculatePoints(rollingTVL, currentUserAddress, rewardsRate);
  }

  return {
    userPoints,
  };
}
