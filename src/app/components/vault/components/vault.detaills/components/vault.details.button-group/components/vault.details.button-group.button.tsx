import { Button } from '@chakra-ui/react';

interface VaultExpandedInformationButtonProps {
  label: string;
  onClick: () => void;
  isDisabled?: boolean;
}

export function VaultExpandedInformationButton({
  label,
  onClick,
  isDisabled,
}: VaultExpandedInformationButtonProps): React.JSX.Element {
  return (
    <Button
      w={'100%'}
      p={'2.5px'}
      bg={'white.04'}
      color={'white.01'}
      fontSize={'sm'}
      fontWeight={'bold'}
      _hover={{ bg: 'pink.01', color: 'white.01' }}
      isDisabled={isDisabled}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
