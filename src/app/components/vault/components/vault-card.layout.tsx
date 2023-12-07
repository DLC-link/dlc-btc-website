import { ReactNode } from 'react';

import { VStack } from '@chakra-ui/react';

interface VaultCardLayoutProps {
  children: ReactNode;
  isSelectable?: boolean;
  handleClick: () => void;
}

export function VaultCardLayout({
  children,
  isSelectable = false,
  handleClick,
}: VaultCardLayoutProps): React.JSX.Element {
  return (
    <VStack
      alignContent={'start'}
      p={'7.5px'}
      h={'auto'}
      w={'100%'}
      spacing={'15px'}
      bgGradient={'linear(to-r, background.content.01, background.content.02)'}
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
