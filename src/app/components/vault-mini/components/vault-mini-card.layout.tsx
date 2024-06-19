import { ReactNode } from 'react';

import { VStack } from '@chakra-ui/react';

interface VaultMiniCardLayoutProps {
  children: ReactNode;
}

export function VaultMiniCardLayout({ children }: VaultMiniCardLayoutProps): React.JSX.Element {
  return (
    <VStack
      alignContent={'start'}
      p={'7.5px'}
      w={'100%'}
      spacing={'15px'}
      bg={'background.content.01'}
      blendMode={'screen'}
      border={'1px solid'}
      borderColor={'border.white.01'}
      borderRadius={'md'}
    >
      {children}
    </VStack>
  );
}
