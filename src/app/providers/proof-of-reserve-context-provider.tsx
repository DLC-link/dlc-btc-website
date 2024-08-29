import { createContext, useEffect } from 'react';

import { useBitcoinPrice } from '@hooks/use-bitcoin-price';
import { useProofOfReserve } from '@hooks/use-proof-of-reserve';
import { useTotalSupply } from '@hooks/use-total-supply';
import { HasChildren } from '@models/has-children';
import { MerchantProofOfReserve } from '@models/merchant';

interface ProofOfReserveContextProviderType {
  proofOfReserve: [number | undefined, MerchantProofOfReserve[]] | undefined;
  totalSupply: number | undefined;
  bitcoinPrice: number | undefined;
}

export const ProofOfReserveContext = createContext<ProofOfReserveContextProviderType>({
  proofOfReserve: undefined,
  totalSupply: undefined,
  bitcoinPrice: undefined,
});

export function ProofOfReserveContextProvider({ children }: HasChildren): React.JSX.Element {
  const { proofOfReserve } = useProofOfReserve();
  const { totalSupply } = useTotalSupply();
  const { bitcoinPrice } = useBitcoinPrice();

  return (
    <ProofOfReserveContext.Provider
      value={{
        proofOfReserve,
        totalSupply,
        bitcoinPrice,
      }}
    >
      {children}
    </ProofOfReserveContext.Provider>
  );
}
