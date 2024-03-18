import { useEffect, useState } from 'react';

import { BitcoinError } from '@models/error-types';

export interface UseBitcoinPriceReturnType {
  bitcoinPrice: number;
}

export function useBitcoinPrice(): UseBitcoinPriceReturnType {
  const [bitcoinPrice, setBitcoinPrice] = useState<number>(0);

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
        const data = await response.json();
        setBitcoinPrice(data.bpi.USD.rate_float);
      } catch (error) {
        throw new BitcoinError(`Error fetching Bitcoin price: ${error}`);
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchBitcoinPrice();
  }, []);

  return { bitcoinPrice };
}
