import { HStack, MenuItem, Text } from '@chakra-ui/react';
import { truncateAddress } from 'dlc-btc-lib/utilities';

interface LedgerModalSelectAddressMenuItemProps {
  index: number;
  address: [string, number];
  paymentType: 'wpkh' | 'tr';
  setFundingAndTaprootAddress: (index: number, paymentType: 'wpkh' | 'tr') => void;
}
export function LedgerModalSelectAddressMenuItem({
  index,
  address,
  paymentType,
  setFundingAndTaprootAddress,
}: LedgerModalSelectAddressMenuItemProps): React.JSX.Element {
  return (
    <MenuItem
      key={index}
      value={index}
      onClick={() => setFundingAndTaprootAddress(index, paymentType)}
    >
      <HStack w={'275px'} justifyContent={'space-between'}>
        <Text>{truncateAddress(address[0])}</Text>
        <Text>{address[1]} BTC</Text>
      </HStack>
    </MenuItem>
  );
}
