import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { HStack, IconButton, Text } from '@chakra-ui/react';

interface LedgerModalSelectAddressMenuAddressPaginatorProps {
  displayedAddressesStartIndex: number;
  setDisplayedAddressesStartIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function LedgerModalSelectAddressMenuAddressPaginator({
  displayedAddressesStartIndex,
  setDisplayedAddressesStartIndex,
}: LedgerModalSelectAddressMenuAddressPaginatorProps): React.JSX.Element {
  return (
    <HStack pt={'2.5%'} w={'100%'} justifyContent={'space-between'}>
      <IconButton
        aria-label={'previous'}
        isDisabled={displayedAddressesStartIndex === 0}
        variant={'ghost'}
        color={'pink.01'}
        icon={<ArrowBackIcon />}
        onClick={() => setDisplayedAddressesStartIndex(displayedAddressesStartIndex - 5)}
      />
      <Text fontSize={'xs'}>
        {displayedAddressesStartIndex + 1} - {displayedAddressesStartIndex + 5}
      </Text>
      <IconButton
        aria-label={'next'}
        variant={'ghost'}
        color={'pink.01'}
        icon={<ArrowForwardIcon />}
        onClick={() => setDisplayedAddressesStartIndex(displayedAddressesStartIndex + 5)}
      />
    </HStack>
  );
}
