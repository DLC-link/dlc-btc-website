import { VStack } from '@chakra-ui/react';
import { FadeLayer } from '@components/fade-layer/fade-layer';
import { HasChildren } from '@models/has-children';

export function AttestorDetailsTableLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack
      w={'100%'}
      h={'500px'}
      p={'15px'}
      bg={'background.container.01'}
      alignItems={'flex-start'}
      borderRadius={'md'}
    >
      <FadeLayer h={'500px'} fh={'35px'}>
        <VStack w={'100%'} h={'500px'} alignItems={'flex-start'} spacing={'15px'}>
          {children}
        </VStack>
      </FadeLayer>
    </VStack>
  );
}
