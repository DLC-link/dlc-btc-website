import { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { Vault } from '@models/vault';
import { BlockchainHeightContext } from '@providers/bitcoin-query-provider';
import { VaultState } from 'dlc-btc-lib/models';

export function useConfirmationChecker(vault?: Vault): number {
  const { blockHeight } = useContext(BlockchainHeightContext);

  let txID;
  switch (vault?.state) {
    case VaultState.FUNDING:
      txID = vault?.fundingTX;
      break;
    case VaultState.PENDING:
      txID = vault?.withdrawTX;
      break;
    default:
      txID = undefined;
  }

  const [blockHeightAtBroadcast, setBlockHeightAtBroadcast] = useState<number | undefined>(
    undefined
  );
  const [transactionProgress, setTransactionProgress] = useState<number>(0);

  const bitcoinExplorerTXURL = `${appConfiguration.bitcoinBlockchainURL}/tx/${txID}`;

  async function fetchTransactionDetails() {
    const response = await fetch(bitcoinExplorerTXURL);
    if (!response.ok) throw new Error('Network response was not ok');
    const transactionDetails = await response.json();
    return transactionDetails.status.block_height;
  }

  const { data: txBlockHeightAtBroadcast } = useQuery(
    ['transactionDetails', txID],
    () => fetchTransactionDetails(),
    {
      enabled:
        !!txID &&
        (vault?.state === VaultState.FUNDING || vault?.state === VaultState.PENDING) &&
        !blockHeightAtBroadcast,
      refetchInterval: 10000,
    }
  );

  useEffect(() => {
    if (txBlockHeightAtBroadcast && typeof txBlockHeightAtBroadcast === 'number') {
      setBlockHeightAtBroadcast(txBlockHeightAtBroadcast);
    }
  }, [txBlockHeightAtBroadcast]);

  useEffect(() => {
    if (
      (vault?.state != VaultState.FUNDING && vault?.state != VaultState.PENDING) ||
      transactionProgress > 6
    )
      return;

    const blockHeightDifference = (blockHeight as number) + 1 - (blockHeightAtBroadcast as number);
    if (typeof blockHeightDifference === 'number' && blockHeightDifference >= 0) {
      setTransactionProgress(blockHeightDifference);
    }
  }, [blockHeightAtBroadcast, blockHeight, vault?.state, transactionProgress]);

  return transactionProgress;
}
