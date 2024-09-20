import { useContext, useRef } from 'react';

import { Vault } from '@models/vault';
import { VaultContext } from '@providers/vault-context-provider';
import { useQuery } from '@tanstack/react-query';

import { useBlockchainHeightQuery } from './use-blockchain-height-query';

export function useConfirmationChecker(): [string, number][] {
  const blockHeight = useBlockchainHeightQuery();
  const { pendingVaults } = useContext(VaultContext);

  const bitcoinTransactionBlockHeightMap = useRef(new Map<string, number>());

  async function fetchBitcoinTransactionConfirmations(vault: Vault): Promise<number> {
    try {
      let bitcoinTransactionBlockHeight: number;

      if (!bitcoinTransactionBlockHeightMap.current.has(vault.withdrawDepositTX)) {
        const bitcoinExplorerTXURL = `${appConfiguration.bitcoinBlockchainURL}/tx/${vault?.withdrawDepositTX}`;

        const bitcoinTransactionResponse = await fetch(bitcoinExplorerTXURL);
        if (!bitcoinTransactionResponse.ok) throw new Error('Could not fetch Bitcoin Transaction');

        const bitcoinTransaction = await bitcoinTransactionResponse.json();
        bitcoinTransactionBlockHeight = bitcoinTransaction.status.block_height;

        if (!bitcoinTransactionBlockHeight)
          throw new Error('Could not fetch Bitcoin Transaction Block Height');
        bitcoinTransactionBlockHeightMap.current.set(
          vault.withdrawDepositTX,
          bitcoinTransactionBlockHeight
        );
      } else {
        bitcoinTransactionBlockHeight = bitcoinTransactionBlockHeightMap.current.get(
          vault.withdrawDepositTX
        )!;
      }

      if (!blockHeight) throw new Error('Block Height is not available');

      const bitcoinTransactionConfirmations = blockHeight + 1 - bitcoinTransactionBlockHeight;
      return bitcoinTransactionConfirmations;
    } catch (error) {
      console.error('Error fetching Bitcoin Transaction Confirmations', error);
      return 0;
    }
  }

  async function fetchAllBitcoinTransactionConfirmations(): Promise<[string, number][]> {
    const bitcoinTransactionConfirmations: [string, number][] = await Promise.all(
      pendingVaults.map(async vault => {
        const confirmations = await fetchBitcoinTransactionConfirmations(vault);
        return [vault.uuid, confirmations] as [string, number];
      })
    );

    const currentPendingVaultTXIDs = new Set(pendingVaults.map(vault => vault.withdrawDepositTX));

    for (const key of bitcoinTransactionBlockHeightMap.current.keys()) {
      if (!currentPendingVaultTXIDs.has(key)) {
        bitcoinTransactionBlockHeightMap.current.delete(key);
      }
    }
    return bitcoinTransactionConfirmations;
  }

  const { data: bitcoinTransactionConfirmations } = useQuery({
    queryKey: ['transactionDetails'],
    initialData: [],
    queryFn: () => fetchAllBitcoinTransactionConfirmations(),
    enabled: pendingVaults.length > 0,
    refetchInterval: 10000,
  });

  return bitcoinTransactionConfirmations;
}
