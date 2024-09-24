import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

import { breakpoints } from '@shared/utils';

export function MerchantDetailsLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack w={breakpoints} spacing={'30px'} alignItems={'flex-start'}>
      {children}
    </VStack>
  );
}
