import { Handler } from '@netlify/functions';
import { Event, ethers } from 'ethers';

import { DetailedEvent } from '../../src/shared/models/ethereum-models';

function formatTransferEvent(
  event: any,
  timestamp: number,
  txHash: string,
  decimals: number
): DetailedEvent {
  const value: number =
    decimals > 8 ? parseInt(ethers.utils.formatUnits(event.value, 10)) : event.value.toNumber();
  return {
    from: event.from.toLowerCase(),
    to: event.to.toLowerCase(),
    value,
    timestamp,
    txHash,
  };
}

// query params:
// - providerURL
// - contractAddress
// - userAddress?
const handler: Handler = async event => {
  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'providerURL and contractAddress is required',
      }),
    };
  }
  const { providerURL, contractAddress, userAddress } = event.queryStringParameters;

  if (!contractAddress) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Contract address is required',
      }),
    };
  }

  const provider = new ethers.providers.StaticJsonRpcProvider(providerURL);

  const contract = new ethers.Contract(
    contractAddress,
    [
      'event Transfer(address indexed from, address indexed to, uint256 value)',
      'function decimals() view returns (uint8)',
    ],
    provider
  );

  let decimals: number;
  try {
    decimals = await contract.decimals();
  } catch (error) {
    console.error('Error fetching decimals', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error fetching decimals',
      }),
    };
  }

  const fromEventsFilter = contract.filters.Transfer(userAddress, null);
  const toEventsFilter = contract.filters.Transfer(null, userAddress);

  const fromEvents = await contract.queryFilter(fromEventsFilter);
  const toEvents = await contract.queryFilter(toEventsFilter);

  // Merge and remove duplicates
  const allEvents = [...fromEvents, ...toEvents].filter(
    (event, index, self) =>
      index ===
      self.findIndex(
        t => t.transactionHash === event.transactionHash && t.logIndex === event.logIndex
      )
  );

  let detailedEvents: DetailedEvent[] = [];

  await Promise.all(
    allEvents.map(async (event: Event) => {
      const block = await provider.getBlock(event.blockNumber);
      detailedEvents.push(
        formatTransferEvent(event.args, block.timestamp, event.transactionHash, decimals)
      );
    })
  );

  detailedEvents.sort((a, b) => b.timestamp - a.timestamp);

  return {
    statusCode: 200,
    body: JSON.stringify({
      detailedEvents,
    }),
  };
};

export { handler };
