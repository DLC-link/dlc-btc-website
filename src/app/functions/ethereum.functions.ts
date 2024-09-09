import { DetailedEvent } from '@models/ethereum-models';
import { Contract } from 'ethers';

export async function fetchMintBurnEvents(
  dlcBTCContract: Contract,
  rpcEndpoint: string,
  ethreumAddress?: string,
  lastN?: number
): Promise<DetailedEvent[]> {
  const contractAddress = dlcBTCContract.address;

  const req = await fetch(
    `/.netlify/functions/fetch-mint-burn-events?providerURL=${rpcEndpoint}&contractAddress=${contractAddress}${ethreumAddress ? `&userAddress=${ethreumAddress}` : ''}&lastN=${lastN}`
  );

  if (!req.ok) {
    throw new Error(`HTTP error! status: ${req.status}`);
  }

  const events = await req.json();
  const detailedEvents: DetailedEvent[] = events.detailedEvents;

  return detailedEvents;
}
