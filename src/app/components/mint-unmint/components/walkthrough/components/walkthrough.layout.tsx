import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function WalkthroughLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack alignItems={'start'} h={'445px'} w={'350px'} spacing={'15px'}>
      {children}
    </VStack>
  );
}
