export function easyTruncateAddress(address: string): string {
  const truncationLength = 4;
  const prefix = address.substring(0, truncationLength);
  const suffix = address.substring(address.length - truncationLength);
  return `${prefix}...${suffix}`;
}
