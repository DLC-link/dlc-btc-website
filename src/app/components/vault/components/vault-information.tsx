import { CheckIcon } from '@chakra-ui/icons';
import { HStack, Image, Text, VStack } from '@chakra-ui/react';
import { VaultState } from 'dlc-btc-lib/models';

import { VaultExpandButton } from './vault-expand-button';

const getAssetLogo = (state: VaultState) => {
  return [VaultState.FUNDED, VaultState.CLOSING, VaultState.CLOSED, VaultState.PENDING].includes(
    state
  )
    ? '/images/logos/dlc-btc-logo.svg'
    : '/images/logos/bitcoin-logo.svg';
};

interface VaultInformationProps {
  collateral: number;
  state: VaultState;
  timestamp: number;
  isExpanded: boolean;
  isSelectable?: boolean;
  isSelected?: boolean;
  handleClick: () => void;
}

export function VaultInformation({
  state,
  collateral,
  timestamp,
  isExpanded,
  isSelectable,
  isSelected,
  handleClick,
}: VaultInformationProps): React.JSX.Element {
  const date = new Date(timestamp * 1000).toLocaleDateString('en-US');

  return (
    <HStack justifyContent={'space-between'} w={'100%'} h={'50px'}>
      <VStack alignItems={'start'} spacing={'0.5'} h={'45px'}>
        <HStack spacing={'15px'} h={'21.25px'}>
          <Image src={getAssetLogo(state)} alt={'Icon'} boxSize={'25px'} />
          <Text color={'white'} fontWeight={800}>
            {collateral}
          </Text>
        </HStack>
        <Text px={'40px'} py={'0px'} color={'white.02'} fontSize={'xs'}>
          {date}
        </Text>
      </VStack>
      {isSelectable ? (
        <VStack
          justifyContent={'center'}
          boxSize={'25px'}
          bgColor={'white.03'}
          border={'1px solid'}
          borderRadius={'full'}
          borderColor={'border.lightBlue.01'}
        >
          {isSelected && <CheckIcon color={'accent.lightBlue.01'} boxSize={'15px'} />}
        </VStack>
      ) : (
        <VaultExpandButton isExpanded={isExpanded} handleClick={() => handleClick()} />
      )}
    </HStack>
  );
}
