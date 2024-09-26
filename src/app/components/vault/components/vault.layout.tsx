import { ReactNode } from 'react';

import { VStack } from '@chakra-ui/react';

interface VaultLayoutProps {
  children: ReactNode;
}

export function VaultLayout({ children }: VaultLayoutProps): React.JSX.Element {
  return (
    <VStack p={'1px'} w={'100%'} bgGradient={`linear(orange.01, purple.01)`} borderRadius={'md'}>
      <VStack
        p={'15px'}
        w={'100%'}
        bg={'background.content.01'}
        borderRadius={'md'}
        spacing={'15px'}
      >
        {children}
      </VStack>
    </VStack>
  );
}
