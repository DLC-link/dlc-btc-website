export function truncateNodeID(nodeID: string): string {
  const start = nodeID.slice(0, 14);
  const end = nodeID.slice(-7);
  return `${start}...${end}`;
} 
