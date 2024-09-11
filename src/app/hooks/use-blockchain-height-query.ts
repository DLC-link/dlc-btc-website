import { useQuery } from '@tanstack/react-query';

export function useBlockchainHeightQuery(): number | undefined {
  const bitcoinExplorerHeightURL = `${appConfiguration.bitcoinBlockchainURL}/blocks/tip/height`;

  async function getBlockchainHeight() {
    const response = await fetch(bitcoinExplorerHeightURL);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  }

  const { data: blockHeight } = useQuery({
    queryKey: ['blockHeight'],
    queryFn: () => getBlockchainHeight(),
    refetchInterval: 10000,
  });

  return blockHeight;
}
