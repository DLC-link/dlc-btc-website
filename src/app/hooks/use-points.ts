import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { BigNumber, Event } from 'ethers';

import { RootState } from '../store';
import { useEthereum } from './use-ethereum';

const BURN_ADDRESS = '0x0000000000000000000000000000000000000000';
// points/TVL(sats)/sec
const REWARDS_RATE = 0.00001;

interface DetailedEvent {
  from: string;
  to: string;
  value: BigNumber;
  timestamp: number;
}

interface UsePointsReturnType {
  userPoints: number | undefined;
}

export function usePoints(): UsePointsReturnType {
  const { address: userAddress, network } = useSelector((state: RootState) => state.account);
  const { getDefaultProvider } = useEthereum();

  const [userPoints, setUserPoints] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchUserPoints = async () => {
      fetchPoints();
    };
    if (userAddress) {
      fetchUserPoints();
    }
  }, [userAddress]);

  function formatTransferEvent(event: any, timestamp: number): DetailedEvent {
    return {
      from: event.from,
      to: event.to,
      value: event.value,
      timestamp,
    };
  }

  // Function to fetch all transfer events from the smart contract
  async function fetchTransferEvents(): Promise<DetailedEvent[]> {
    const contract = await getDefaultProvider(network, 'DLCBTC');
    const filter = contract.filters.Transfer();
    const events = await contract.queryFilter(filter);
    const detailedEvents: DetailedEvent[] = [];

    // Fetch detailed information including timestamps
    await Promise.all(
      events.map(async (event: Event) => {
        const block = await contract.provider.getBlock(event.blockNumber);
        detailedEvents.push(formatTransferEvent(event.args, block.timestamp));
      })
    );

    detailedEvents.sort((a, b) => a.timestamp - b.timestamp);

    console.log('detailedEvents: ', detailedEvents);
    return detailedEvents;
  }

  // {
  //   [ // list of addresses
  //     {
  //       '0x123':
  //       [
  //         { timestamp: 1650000000, amount: 50, totalValueLocked: 50}, // at time 1650000000 Points are 100 minted - 50 burned
  //         { tiemstamp: 1700000000, amount: -20, totalValueLocked: 30}, // at time 1700000000 Points are 20 burned
  //       ],
  //     }
  //   ]
  // }

  interface TimeStampedEvent {
    timestamp: number;
    amount: number;
    totalValueLocked: number;
  }

  interface RollingTVLMap {
    [address: string]: TimeStampedEvent[];
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

    console.log('rollingTVLMap: ', rollingTVLMap);
    return rollingTVLMap;
  }

  interface Rewards {
    [address: string]: number;
  }

  function calculateReward(previousEvent: TimeStampedEvent, currentEvent: TimeStampedEvent) {
    const rewardsPerTime = previousEvent.totalValueLocked * REWARDS_RATE;
    const rewards = rewardsPerTime * (currentEvent.timestamp - previousEvent.timestamp);
    return rewards;
  }

  // Calculate the points rewarded to each address
  function calculatePoints(rollingTVLMap: RollingTVLMap): void {
    const rewards: Rewards = {};
    const currentTimestamp = Math.floor(Date.now() / 1000);

    for (const [address, events] of Object.entries(rollingTVLMap)) {
      let totalRewards = 0;
      for (let i = 1; i < events.length; i++) {
        totalRewards += calculateReward(events[i - 1], events[i]);
      }

      const lastEvent = events[events.length - 1];
      if (lastEvent) {
        totalRewards += calculateReward(lastEvent, {
          timestamp: currentTimestamp,
          totalValueLocked: lastEvent.totalValueLocked,
          amount: 0,
        });
        rewards[address] = totalRewards;
      }
    }
    if (!userAddress) {
      throw new Error('User address is not set');
    }

    setUserPoints(rewards[userAddress]);
  }

  async function fetchPoints() {
    const events = await fetchTransferEvents();
    const rollingTVL = calculateRollingTVL(events);
    calculatePoints(rollingTVL);
  }

  return {
    userPoints,
  };
}
