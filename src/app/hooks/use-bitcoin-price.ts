import { BitcoinError } from '@models/error-types';
import { useQuery } from '@tanstack/react-query';

interface UseBitcoinPriceReturnType {
  bitcoinPrice: number | undefined;
}

export function useBitcoinPrice(): UseBitcoinPriceReturnType {
  const fetchBitcoinPrice = async (): Promise<number> => {
    try {
      const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
      const data = await response.json();
      return data.bpi.USD.rate_float;
    } catch (error) {
      throw new BitcoinError(`Error fetching Bitcoin price: ${error}`);
    }
  };

  const { data: bitcoinPrice } = useQuery<number, BitcoinError>({
    queryKey: ['bitcoinPrice'],
    queryFn: fetchBitcoinPrice,
    refetchInterval: 60000,
  });

  return { bitcoinPrice };
}
