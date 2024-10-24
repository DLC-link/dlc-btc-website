import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

import { breakpoints } from '@shared/utils';

export function AttestorDetailsLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack w={breakpoints} spacing={'20px'} align={'left'}>
      {children}
    </VStack>
  );
}
