import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function LandingPageLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack w={'65%'} spacing={'0px'}>
      {children}
    </VStack>
  );
}
