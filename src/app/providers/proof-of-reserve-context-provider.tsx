import { createContext } from 'react';

import { useBitcoinPrice } from '@hooks/use-bitcoin-price';
import { useMintBurnEvents } from '@hooks/use-mint-burn-events';
import { useProofOfReserve } from '@hooks/use-proof-of-reserve';
import { useTotalSupply } from '@hooks/use-total-supply';
import { HasChildren } from '@models/has-children';
import { MerchantProofOfReserve } from '@models/merchant';
import { DetailedEvent } from 'dlc-btc-lib/models';

interface ProofOfReserveContextProviderType {
  proofOfReserve: [number | undefined, MerchantProofOfReserve[]] | undefined;
  totalSupply: number | undefined;
  bitcoinPrice: number | undefined;
  allMintBurnEvents: DetailedEvent[] | undefined;
  merchantMintBurnEvents: { name: string; mintBurnEvents: DetailedEvent[] }[] | undefined;
}

export const ProofOfReserveContext = createContext<ProofOfReserveContextProviderType>({
  proofOfReserve: undefined,
  totalSupply: undefined,
  bitcoinPrice: undefined,
  allMintBurnEvents: undefined,
  merchantMintBurnEvents: undefined,
});

export function ProofOfReserveContextProvider({ children }: HasChildren): React.JSX.Element {
  const { proofOfReserve } = useProofOfReserve();
  const { totalSupply } = useTotalSupply();
  const { bitcoinPrice } = useBitcoinPrice();
  const { allMintBurnEvents, merchantMintBurnEvents } = useMintBurnEvents();

  return (
    <ProofOfReserveContext.Provider
      value={{
        proofOfReserve,
        totalSupply,
        bitcoinPrice,
        allMintBurnEvents,
        merchantMintBurnEvents,
      }}
    >
      {children}
    </ProofOfReserveContext.Provider>
  );
}
