import { VStack, useBreakpointValue } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function MerchantTableLayout({ children }: HasChildren): React.JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <VStack
      w={isMobile ? '100%' : '50%'}
      h={isMobile ? 'auto' : '275px'}
      alignItems={'flex-start'}
      borderRadius={'md'}
    >
      {children}
    </VStack>
  );
}
