import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function PageLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack justifyContent={'center'} pt={'75px'} spacing={'20px'}>
      {children}
    </VStack>
  );
}
