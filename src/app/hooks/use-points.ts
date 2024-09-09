import { PointsData } from '@models/points.models';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { POINTS_API_URL } from '@shared/constants/api.constants';

interface UsePointsReturnType {
  userPoints: PointsData | undefined;
}

export function usePoints(): UsePointsReturnType {
  const { address } = useAccount();

  async function fetchUserPoints(): Promise<PointsData | undefined> {
    try {
      const response = await fetch(
        `${POINTS_API_URL}/${appConfiguration.appEnvironment}/${address}`
      );

      if (!response.ok) {
        throw new Error(`Error fetching user: ${address} points`);
      }

      const responseData = await response.json();

      return responseData.points;
    } catch (error) {
      console.error(`Error fetching user: ${address} points`, error);
      return undefined;
    }
  }

  const { data: userPoints } = useQuery({
    queryKey: ['userPoints', address],
    queryFn: fetchUserPoints,
    enabled: !!address,
  });

  return {
    userPoints,
  };
}
