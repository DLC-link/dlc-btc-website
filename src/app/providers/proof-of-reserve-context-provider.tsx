import { createContext } from 'react';

import { useEthereum } from '@hooks/use-ethereum';
import { useProofOfReserve } from '@hooks/use-proof-of-reserve';
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
  const { totalSupply } = useEthereum();

  return (
    <ProofOfReserveContext.Provider value={{ proofOfReserve, totalSupply }}>
      {children}
    </ProofOfReserveContext.Provider>
  );
}
