import { HStack, MenuItem, Text } from '@chakra-ui/react';
import { easyTruncateAddress } from '@common/utilities';

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
        <Text>{easyTruncateAddress(address[0])}</Text>
        <Text>{address[1]} BTC</Text>
      </HStack>
    </MenuItem>
  );
}
