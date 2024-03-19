import { useEffect, useMemo, useRef, useState } from 'react';

import { Vault, VaultState } from '@models/vault';

export function useConfirmationChecker(vault?: Vault): number {
  const txID = vault?.state === VaultState.FUNDING ? vault?.fundingTX : vault?.closingTX;

  const bitcoinBlockchainAPIURL = import.meta.env.VITE_BITCOIN_BLOCKCHAIN_API_URL;

  const bitcoinExplorerTXURL = `${bitcoinBlockchainAPIURL}/tx/${txID}`;
  const bitcoinExplorerHeightURL = `${bitcoinBlockchainAPIURL}/blocks/tip/height`;
  const fetchInterval = useRef<number | undefined>(undefined);

  const [transactionProgress, setTransactionProgress] = useState(0);

  const memoizedTransactionProgress = useMemo(() => transactionProgress, [transactionProgress]);

  const fetchTransactionDetails = async () => {
    if (!txID || (vault?.state && ![VaultState.FUNDING, VaultState.CLOSED].includes(vault.state))) {
      clearInterval(fetchInterval.current);
      return;
    }

    let bitcoinCurrentBlockHeight;
    try {
      const response = await fetch(bitcoinExplorerHeightURL, {
        headers: { Accept: 'application/json' },
      });
      bitcoinCurrentBlockHeight = await response.json();
    } catch (error) {
      console.error(error);
    }

    let bitcoinTransactionBlockHeight;

    try {
      const response = await fetch(bitcoinExplorerTXURL, {
        headers: { Accept: 'application/json' },
      });
      const bitcoinTransactionDetails = await response.json();
      bitcoinTransactionBlockHeight = bitcoinTransactionDetails.status.block_height;
    } catch (error) {
      console.error(error);
    }

    const difference = bitcoinCurrentBlockHeight - bitcoinTransactionBlockHeight;

    setTransactionProgress(difference > 0 ? difference : 0);

    if (difference > 6) {
      clearInterval(fetchInterval.current);
    }
  };

  fetchTransactionDetails();

  useEffect(() => {
    fetchInterval.current = setInterval(fetchTransactionDetails, 10000) as unknown as number; // Cleanup the interval when the component unmounts
    return () => clearInterval(fetchInterval.current);
  }, [vault?.state, txID]);

  return memoizedTransactionProgress;
}
