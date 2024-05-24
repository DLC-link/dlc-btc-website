// import { ethers } from 'ethers';

// // Define provider and contract details
// const provider = new ethers.providers.JsonRpcProvider('your_rpc_url');
// const arbitrumTokenContractAddress = '0x050C24dBf1eEc17babE5fc585F06116A259CC77A';
// const burnAddress = '0x0000000000000000000000000000000000000000';
// const abi = [
//   'event Transfer(address indexed from, address indexed to, uint amount, uint256 indexed blockNumber)',
// ];

// // Setup the contract instance
// const contract = new ethers.Contract(arbitrumTokenContractAddress, abi, provider);

// // Function to fetch all transfer events from the smart contract
// async function fetchTransferEvents() {
//   const filter = contract.filters.Transfer();
//   const events = await contract.queryFilter(filter);
//   const detailedEvents = [];

//   // Fetch detailed information including timestamps
//   for (const event of events) {
//     const block = await provider.getBlock(event.blockNumber);
//     detailedEvents.push({ ...event.args, timestamp: block.timestamp });
//   }

//   return detailedEvents;
// }

// // My vision is that the pointsMap which is being used in the function to store the points per time would look like this:
// // {
// //   [ // list of addresses
// //     {
// //       '0x123':
// //       [
// //         { timestamp: 1650000000, amount: 50}, // at time 1650000000 Points are 100 minted - 50 burned
// //         { tiemstamp: 1700000000, amount: -20}, // at time 1700000000 Points are 20 burned
// //       ],
// //     }
// //   ]
// // }

// // Function to calculate points for tokens minted over time, grouped by hourly slots
// export function calculateMintedPointsHourly(events) {
//   const pointsMap = {};

//   events.forEach(({ from, to, amount, timestamp }) => {
//     const hourSlot = Math.floor(timestamp / 3600) * 3600; // Timestamp rounded down to the nearest hour

//     if (!(to in pointsMap)) {
//       pointsMap[to] = {};
//     }

//     if (!(hourSlot in pointsMap[to])) {
//       pointsMap[to][hourSlot] = 0;
//     }

//     if (from === burnAddress) {
//       pointsMap[to][hourSlot] += amount.toNumber();
//     } else if (to === burnAddress) {
//       pointsMap[from][hourSlot] = (pointsMap[from][hourSlot] || 0) - amount.toNumber();
//     }
//   });

//   // Output the results
//   for (const [address, hours] of Object.entries(pointsMap)) {
//     console.log(`Address: ${address}`);
//     for (const [hour, points] of Object.entries(hours)) {
//       console.log(`Hour: ${new Date(hour * 1000).toLocaleString()}, Points: ${points}`);
//     }
//   }
// }

// // Example usage
// async function run() {
//   const events = await fetchTransferEvents();
//   await calculateMintedPointsHourly(events);
// }

// run().catch(console.error);
