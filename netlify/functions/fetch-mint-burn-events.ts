import { Handler } from '@netlify/functions';
import { Event, ethers } from 'ethers';

import { DetailedEvent } from '../../src/shared/models/ethereum-models';

function formatTransferEvent(event: any, timestamp: number, txHash: string): DetailedEvent {
  return {
    from: event.from.toLowerCase(),
    to: event.to.toLowerCase(),
    value: event.value.toNumber(),
    timestamp,
    txHash,
  };
}

// query params:
// - providerURL
// - contractAddress
// - userAddress?
// - lastN ?
const handler: Handler = async event => {
  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'providerURL and contractAddress is required',
      }),
    };
  }
  const { providerURL, contractAddress, userAddress, lastN } = event.queryStringParameters;

  if (!contractAddress) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Contract address is required',
      }),
    };
  }

  const provider = new ethers.providers.JsonRpcProvider(providerURL);
  const contract = new ethers.Contract(
    contractAddress,
    ['event Transfer(address indexed from, address indexed to, uint256 value)'],
    provider
  );

  const eventFilterTo = contract.filters.Transfer(
    ethers.constants.AddressZero,
    userAddress ?? null
  );
  const eventFilterFrom = contract.filters.Transfer(
    userAddress ?? null,
    ethers.constants.AddressZero
  );
  const eventsTo = await contract.queryFilter(eventFilterTo);
  const eventsFrom = await contract.queryFilter(eventFilterFrom);

  const lastNEvents = (n: number, events: Event[]) => {
    return events.slice(events.length - n);
  };

  const n = lastN ? parseInt(lastN) : null;

  const events = n
    ? [...lastNEvents(n, eventsTo), ...lastNEvents(n, eventsFrom)]
    : [...eventsTo, ...eventsFrom];

  let detailedEvents: DetailedEvent[] = [];

  await Promise.all(
    events.map(async (event: Event) => {
      const block = await provider.getBlock(event.blockNumber);
      detailedEvents.push(formatTransferEvent(event.args, block.timestamp, event.transactionHash));
    })
  );

  detailedEvents.sort((a, b) => b.timestamp - a.timestamp);

  detailedEvents = n ? detailedEvents.slice(0, n) : detailedEvents;

  return {
    statusCode: 200,
    body: JSON.stringify({
      detailedEvents,
    }),
  };
};

export { handler };
