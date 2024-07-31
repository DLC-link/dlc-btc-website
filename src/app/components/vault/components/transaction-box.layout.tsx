import { ReactNode } from 'react';

import { VStack } from '@chakra-ui/react';

interface TransactionBoxLayoutProps {
  children: ReactNode;
  isSelectable?: boolean;
  handleClick: () => void;
}

export function TransactionBoxLayout({
  children,
  isSelectable = false,
  handleClick,
}: TransactionBoxLayoutProps): React.JSX.Element {
  return (
    <VStack
      alignItems={'start'}
      p={'15px'}
      w={'300px'}
      h={'125px'}
      spacing={'15px'}
      bg={'card.background.01'}
      blendMode={'screen'}
      border={'1px solid'}
      borderColor={'border.white.01'}
      borderRadius={'md'}
      _hover={isSelectable ? { cursor: 'pointer' } : {}}
      onClick={isSelectable ? handleClick : () => {}}
    >
      {children}
    </VStack>
  );
}
