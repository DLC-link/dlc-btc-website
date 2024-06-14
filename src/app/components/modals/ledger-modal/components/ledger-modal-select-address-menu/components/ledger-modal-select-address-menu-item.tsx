import { HStack, MenuItem, Text } from '@chakra-ui/react';
import { truncateAddress } from 'dlc-btc-lib/utilities';

interface LedgerModalSelectAddressMenuItemProps {
  index: number;
  address: [string, number];
  setNativeSegwitAddressAndTaprootMultisigAddress: (index: number) => void;
}
export function LedgerModalSelectAddressMenuItem({
  index,
  address,
  setNativeSegwitAddressAndTaprootMultisigAddress,
}: LedgerModalSelectAddressMenuItemProps): React.JSX.Element {
  return (
    <MenuItem
      key={index}
      value={index}
      onClick={() => setNativeSegwitAddressAndTaprootMultisigAddress(index)}
    >
      <HStack w={'275px'} justifyContent={'space-between'}>
        <Text>{truncateAddress(address[0])}</Text>
        <Text>{address[1]} BTC</Text>
      </HStack>
    </MenuItem>
  );
}
