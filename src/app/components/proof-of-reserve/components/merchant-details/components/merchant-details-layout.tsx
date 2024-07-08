import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function MerchantDetailsLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack w={'1280px'} spacing={'30px'} alignItems={'flex-start'}>
      {children}
    </VStack>
  );
}
