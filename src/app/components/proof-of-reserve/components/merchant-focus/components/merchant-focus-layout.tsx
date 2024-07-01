import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function MerchantFocusLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack w={'1280px'} spacing={'20px'} alignItems={'flex-start'}>
      {children}
    </VStack>
  );
}
