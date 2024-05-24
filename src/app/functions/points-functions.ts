import { ethers } from 'ethers';

// Define provider and contract details
const provider = new ethers.providers.JsonRpcProvider('your_rpc_url');
const arbitrumTokenContractAddress = '0x050C24dBf1eEc17babE5fc585F06116A259CC77A';
const burnAddress = '0x0000000000000000000000000000000000000000';
const abi = [
  'event Transfer(address indexed from, address indexed to, uint amount, uint256 indexed blockNumber)',
];

// Setup the contract instance
const contract = new ethers.Contract(arbitrumTokenContractAddress, abi, provider);

// Function to fetch all transfer events from the smart contract
async function fetchTransferEvents() {
  const filter = contract.filters.Transfer();
  const events = await contract.queryFilter(filter);
  const detailedEvents = [];

  // Fetch detailed information including timestamps
  for (const event of events) {
    const block = await provider.getBlock(event.blockNumber);
    detailedEvents.push({ ...event.args, timestamp: block.timestamp });
  }

  return detailedEvents;
}

// Function to calculate points for tokens minted over time, grouped by hourly slots
export function calculateMintedPointsHourly(events) {
  const pointMap = {};

  events.forEach(({ from, to, amount, timestamp }) => {
    const hourSlot = Math.floor(timestamp / 3600) * 3600; // Timestamp rounded down to the nearest hour

    if (!(to in pointMap)) {
      pointMap[to] = {};
    }

    if (!(hourSlot in pointMap[to])) {
      pointMap[to][hourSlot] = 0;
    }

    if (from === burnAddress) {
      pointMap[to][hourSlot] += amount.toNumber();
    } else if (to === burnAddress) {
      pointMap[from][hourSlot] = (pointMap[from][hourSlot] || 0) - amount.toNumber();
    }
  });

  // Output the results
  for (const [address, hours] of Object.entries(pointMap)) {
    console.log(`Address: ${address}`);
    for (const [hour, points] of Object.entries(hours)) {
      console.log(`Hour: ${new Date(hour * 1000).toLocaleString()}, Points: ${points}`);
    }
  }
}

// Example usage
async function run() {
  const events = await fetchTransferEvents();
  await calculateMintedPointsHourly(events);
}

run().catch(console.error);
