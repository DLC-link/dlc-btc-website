import { useEffect, useMemo, useRef, useState } from "react";

import { VaultState } from "@models/vault";

export function useConfirmationChecker(
  txID: string | undefined,
  vaultState: VaultState | undefined,
): number {
  const bitcoinExplorerTXURL = `https://devnet.dlc.link/electrs/tx/${txID}`;
  const bitcoinExplorerHeightURL = `https://devnet.dlc.link/electrs/blocks/tip/height`;
  const fetchInterval = useRef<number | undefined>(undefined);

  const [transactionProgress, setTransactionProgress] = useState(0);

  const memoizedTransactionProgress = useMemo(
    () => transactionProgress,
    [transactionProgress],
  );

  const fetchTransactionDetails = async () => {
    if (
      !txID ||
      (vaultState &&
        ![VaultState.FUNDING, VaultState.CLOSED].includes(vaultState))
    ) {
      clearInterval(fetchInterval.current);
      return;
    }

    let bitcoinCurrentBlockHeight;
    try {
      const response = await fetch(bitcoinExplorerHeightURL, {
        headers: { Accept: "application/json" },
      });
      bitcoinCurrentBlockHeight = await response.json();
    } catch (error) {
      console.error(error);
    }

    let bitcoinTransactionBlockHeight;

    try {
      const response = await fetch(bitcoinExplorerTXURL, {
        headers: { Accept: "application/json" },
      });
      const bitcoinTransactionDetails = await response.json();
      bitcoinTransactionBlockHeight =
        bitcoinTransactionDetails.status.block_height;
    } catch (error) {
      console.error(error);
    }

    const difference =
      bitcoinCurrentBlockHeight - bitcoinTransactionBlockHeight;

    setTransactionProgress(difference);

    if (difference > 6) {
      clearInterval(fetchInterval.current);
    }
  };

  fetchTransactionDetails();

  useEffect(() => {
    fetchInterval.current = setInterval(
      fetchTransactionDetails,
      10000,
    ) as unknown as number; // Cleanup the interval when the component unmounts
    return () => clearInterval(fetchInterval.current);
  }, []);

  return memoizedTransactionProgress;
}
