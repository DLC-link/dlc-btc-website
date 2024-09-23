import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Button, HStack, Text } from '@chakra-ui/react';

interface VaultActionButtonProps {
  isExpanded: boolean;
  handleClick: () => void;
  variant?: 'select' | 'selected';
}

export function VaultActionButton({
  isExpanded,
  handleClick,
  variant,
}: VaultActionButtonProps): React.JSX.Element {
  return (
    <Button
      w={'100%'}
      variant={'outline'}
      borderColor={'accent.lightBlue.01'}
      _hover={{ bg: 'accent.lightBlue.01', color: 'white.01' }}
      onClick={() => handleClick()}
      p={'15px'}
    >
      <HStack w={'100%'} justifyContent={'space-between'}>
        <HStack w={'100%'} justifyContent={'center'}>
          <Text color={'white.01'} fontSize={'sm'}>
            {variant === 'select' ? 'Select' : isExpanded ? 'Less' : 'More'}
          </Text>
        </HStack>
        {variant !== 'select' &&
          (isExpanded ? (
            <ChevronUpIcon color={'white'} boxSize={'25px'} p={'0px'} />
          ) : (
            <ChevronDownIcon color={'white'} boxSize={'25px'} p={'0px'} />
          ))}
      </HStack>
    </Button>
  );
}
