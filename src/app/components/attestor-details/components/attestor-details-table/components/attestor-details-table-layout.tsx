import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function AttestorDetailsTableLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack
      w={'100%'}
      h={'520px'}
      p={'15px'}
      bg={'background.container.01'}
      alignItems={'flex-start'}
      borderRadius={'md'}
    >
      <VStack w={'100%'} alignItems={'flex-start'} spacing={'15px'}>
        {children}
      </VStack>
    </VStack>
  );
}
