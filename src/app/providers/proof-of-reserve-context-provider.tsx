import { createContext } from 'react';

import { useProofOfReserve } from '@hooks/use-proof-of-reserve';
import { useTotalSupply } from '@hooks/use-total-supply';
import { HasChildren } from '@models/has-children';
import { MerchantProofOfReserve } from '@models/merchant';

interface ProofOfReserveContextProviderType {
  proofOfReserve: number | undefined;
  merchantProofOfReserve: MerchantProofOfReserve[] | undefined;
  totalSupply: number | undefined;
}

export const ProofOfReserveContext = createContext<ProofOfReserveContextProviderType>({
  proofOfReserve: undefined,
  merchantProofOfReserve: undefined,
  totalSupply: undefined,
});

export function ProofOfReserveContextProvider({ children }: HasChildren): React.JSX.Element {
  const { proofOfReserve, merchantProofOfReserve } = useProofOfReserve();
  const { totalSupply } = useTotalSupply();

  return (
    <ProofOfReserveContext.Provider value={{ proofOfReserve, merchantProofOfReserve, totalSupply }}>
      {children}
    </ProofOfReserveContext.Provider>
  );
}
