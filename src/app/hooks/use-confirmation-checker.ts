import { useContext } from 'react';

import { Vault } from '@models/vault';
import { VaultContext } from '@providers/vault-context-provider';
import { useQuery } from '@tanstack/react-query';

import { useBlockchainHeightQuery } from './use-blockchain-height-query';

export function useConfirmationChecker(): [string, number][] {
  const blockHeight = useBlockchainHeightQuery();
  const { pendingVaults } = useContext(VaultContext);

  async function fetchBitcoinTransactionConfirmations(vault: Vault): Promise<number> {
    const bitcoinExplorerTXURL = `${appConfiguration.bitcoinBlockchainURL}/tx/${vault?.withdrawDepositTX}`;

    const bitcoinTransactionResponse = await fetch(bitcoinExplorerTXURL);
    if (!bitcoinTransactionResponse.ok) return 0;

    const bitcoinTransaction = await bitcoinTransactionResponse.json();
    const bitcoinTransactionBlockHeight = bitcoinTransaction.status.block_height;

    if (!bitcoinTransactionBlockHeight || !blockHeight) return 0;

    const bitcoinTransactionConfirmations = blockHeight + 1 - bitcoinTransactionBlockHeight;
    return bitcoinTransactionConfirmations;
  }

  async function fetchAllBitcoinTransactionConfirmations(): Promise<[string, number][]> {
    const bitcoinTransactionConfirmations: [string, number][] = await Promise.all(
      pendingVaults.map(async vault => {
        const confirmations = await fetchBitcoinTransactionConfirmations(vault);
        return [vault.uuid, confirmations] as [string, number];
      })
    );
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
