import { createContext } from 'react';
import { useEffect } from 'react';

import { usePoints } from '@hooks/use-points';
import { useProofOfReserve } from '@hooks/use-proof-of-reserve';
import { useTotalSupply } from '@hooks/use-total-supply';
import { HasChildren } from '@models/has-children';

interface ProofOfReserveContextProviderType {
  proofOfReserve: number | undefined;
  totalSupply: number | undefined;
}

export const ProofOfReserveContext = createContext<ProofOfReserveContextProviderType>({
  proofOfReserve: undefined,
  totalSupply: undefined,
});

export function ProofOfReserveContextProvider({ children }: HasChildren): React.JSX.Element {
  const { proofOfReserve } = useProofOfReserve();
  const { totalSupply } = useTotalSupply();
  const { userPoints } = usePoints();

  useEffect(() => {
    if (userPoints) {
      console.log('user points', userPoints);
    }
  }, [userPoints]);

  return (
    <ProofOfReserveContext.Provider value={{ proofOfReserve, totalSupply }}>
      {children}
    </ProofOfReserveContext.Provider>
  );
}
