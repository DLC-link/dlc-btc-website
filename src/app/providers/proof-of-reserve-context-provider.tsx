import { createContext } from 'react';

import { useProofOfReserve } from '@hooks/use-proof-of-reserve';
import { HasChildren } from '@models/has-children';

interface ProofOfReserveContextProviderType {
  proofOfReserve: number | undefined;
}

export const ProofOfReserveContext = createContext<ProofOfReserveContextProviderType>({
  proofOfReserve: undefined,
});

export function ProofOfReserveContextProvider({ children }: HasChildren): React.JSX.Element {
  const { proofOfReserve } = useProofOfReserve();

  return (
    <ProofOfReserveContext.Provider value={{ proofOfReserve }}>
      {children}
    </ProofOfReserveContext.Provider>
  );
}
