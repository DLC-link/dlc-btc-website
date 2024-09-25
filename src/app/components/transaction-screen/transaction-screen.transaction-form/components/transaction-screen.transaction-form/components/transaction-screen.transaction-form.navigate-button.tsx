import { Button } from '@chakra-ui/react';

interface TransactionFormNavigateButtonProps {
  label: string;
  onClick: () => void;
}

export function TransactionFormNavigateButton({
  label,
  onClick,
}: TransactionFormNavigateButtonProps): React.JSX.Element {
  return (
    <Button
      w={'50%'}
      p={'2.5px'}
      bg={'white.04'}
      color={'white.01'}
      fontSize={'sm'}
      fontWeight={'bold'}
      _hover={{ bg: 'accent.lightBlue.01', color: 'white.01' }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
