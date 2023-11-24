import { useEffect, useState } from "react";

export function useConfirmationChecker(
  txID: string | undefined,
): number | boolean {
  const bitcoinExplorerTXURL = `http://stx-btc1.dlc.link:8001/tx/${txID}`;
  const bitcoinExplorerHeightURL = `http://stx-btc1.dlc.link:8001//blocks/tip/height`;

  const [confirmations, setConfirmations] = useState<number | boolean>(0);

  useEffect(() => {
    if (!txID) return;
    const interval = setInterval(async () => {
      try {
        const txResponse = await fetch(bitcoinExplorerTXURL);
        const txData = await txResponse.json();

        const heightResponse = await fetch(bitcoinExplorerHeightURL);
        const heightData = await heightResponse.json();

        const currentConfirmations = heightData - txData.status.block_height;
        setConfirmations(currentConfirmations);

        if (currentConfirmations >= 6) {
          clearInterval(interval);
          setConfirmations(true);
        }
      } catch (error) {
        console.error(error);
        clearInterval(interval);
        setConfirmations(false);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [txID]);

  return confirmations;
}
