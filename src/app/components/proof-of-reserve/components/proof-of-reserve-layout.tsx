import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

import { breakpoints } from '@shared/utils';

export function ProofOfReserveLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack w={breakpoints} spacing={'20px'}>
      {children}
    </VStack>
  );
}
