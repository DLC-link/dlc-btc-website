import { useEffect, useState } from 'react';

import { getEthereumNetworkDeploymentPlans } from '@functions/configuration.functions';
import {
  DetailedEvent,
  PointsData,
  ProtocolRewards,
  TimeStampedEvent,
} from '@models/ethereum-models';
import Decimal from 'decimal.js';
import { Chain } from 'viem';
import { useAccount } from 'wagmi';

interface UsePointsReturnType {
  userPoints: PointsData | undefined;
}

// The reason why this same function works for the Curve Gauge as well as dlcBTC:
// The gauge is minting gaugeTokens to the user on Deposit, that can be transferred.
// So to track the user's TVL, we can track the user's gaugeToken balance.
export function calculateRollingTVL(
  events: DetailedEvent[],
  userAddress: string
): TimeStampedEvent[] {
  return events.reduce<TimeStampedEvent[]>((rollingTVL, { from, value, timestamp }) => {
    const currentTotalValueLocked =
      rollingTVL.length > 0 ? rollingTVL[rollingTVL.length - 1].totalValueLocked : 0;
    const amount = from === userAddress ? -value : value;

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
    if (array.length === 1) {
      return calculateRewardBetweenEvents(
        currentEvent,
        {
          timestamp: currentTimestamp,
          totalValueLocked: currentEvent.totalValueLocked,
          amount: 0,
        },
        rewardsRate
      );
    }
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

async function fetchTransfersForUser(
  ethereumNetwork: Chain,
  userAddress: string,
  contractAddress?: string
): Promise<DetailedEvent[]> {
  const providerURL = ethereumNetwork.rpcUrls.default.http[0];

  if (!contractAddress) {
    const dlcBTCContract = getEthereumNetworkDeploymentPlans(ethereumNetwork).find(
      plan => plan.contract.name === 'DLCBTC'
    );

    if (!dlcBTCContract) {
      throw new Error('DLCBTC Contract not found in Deployment Plans');
    }
    contractAddress = dlcBTCContract.contract.address;
  }

  const req = await fetch(
    `/.netlify/functions/fetch-transfer-events?providerURL=${providerURL}&contractAddress=${contractAddress}&userAddress=${userAddress}`
  );

  if (!req.ok) {
    // throw new Error(`HTTP error! status: ${req.status}`);
    return [];
  }

  const events = await req.json();
  const detailedEvents: DetailedEvent[] = events.detailedEvents;

  return detailedEvents;
}

export function usePoints(): UsePointsReturnType {
  const { address, chain } = useAccount();

  const [userPoints, setUserPoints] = useState<PointsData | undefined>(undefined);

  const protocolRewardDefinitions = [
    {
      description: 'Holding dlcBTC in user wallet',
      name: 'dlcBTC',
      multiplier: 1,
      getRollingTVL: async (userAddress: string): Promise<TimeStampedEvent[]> => {
        const events = await fetchTransfersForUser(chain!, address!);
        events.sort((a, b) => a.timestamp - b.timestamp);
        const rollingTVL = calculateRollingTVL(events, userAddress);
        return rollingTVL;
      },
    },
    {
      description: 'Staking LP tokens in DLCBTC/WBTC gauge',
      name: 'Curve',
      multiplier: 5,
      getRollingTVL: async (userAddress: string): Promise<TimeStampedEvent[]> => {
        const gaugeAddress = appConfiguration.protocols.find(p => p.name === 'Curve')?.gaugeAddress;
        if (!gaugeAddress) {
          return [];
        }
        const events = await fetchTransfersForUser(chain!, address!, gaugeAddress);
        events.sort((a, b) => a.timestamp - b.timestamp);
        const rollingTVL = calculateRollingTVL(events, userAddress);
        return rollingTVL;
      },
    },
  ];

  useEffect(() => {
    const fetchUserPoints = async (currentUserAddress: string) => {
      void fetchPoints(currentUserAddress);
    };
    if (address) {
      void fetchUserPoints(address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  async function fetchPoints(currentUserAddress: string): Promise<void> {
    // This is the default 1x reward rate of 10000 points/day/BTC
    const rewardsRate = import.meta.env.VITE_REWARDS_RATE;
    if (!rewardsRate) {
      throw new Error('Rewards Rate not set');
    }

    let totalPoints = 0;
    const protocolRewards: ProtocolRewards[] = [];
    for (const protocol of protocolRewardDefinitions) {
      const rollingTVL = await protocol.getRollingTVL(currentUserAddress);
      const points = calculatePoints(rollingTVL, rewardsRate * protocol.multiplier);
      totalPoints += points;
      protocolRewards.push({
        name: protocol.name,
        points: points,
        currentDLCBTC: rollingTVL.length ? rollingTVL[rollingTVL.length - 1].totalValueLocked : 0,
        multiplier: protocol.multiplier,
      });
    }

    setUserPoints({ total: totalPoints, protocols: protocolRewards });
  }

  return {
    userPoints,
  };
}
