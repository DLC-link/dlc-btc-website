import { useQuery } from '@tanstack/react-query';

const TOTAL_SUPPLY_API_URL = 'https://dlc-link-api-30248018978b.herokuapp.com/dlcbtc/total-supply';

interface UseTotalSupplyReturnType {
  totalSupply: number | undefined;
}

export function useTotalSupply(): UseTotalSupplyReturnType {
  const fetchTotalSupply = async () => {
    try {
      const response = await fetch(`${TOTAL_SUPPLY_API_URL}/${appConfiguration.appEnvironment}`);

      if (!response.ok) {
        throw new Error(`Response was not OK: ${response.status}`);
      }

      const responseData = await response.json();

      return responseData;
    } catch (error) {
      console.error('Error fetching Total Supply', error);
      return undefined;
    }
  };

  const { data: totalSupply } = useQuery({
    queryKey: ['totalSupply'],
    queryFn: fetchTotalSupply,
    refetchInterval: 60000,
  });

  return {
    totalSupply,
  };
}
