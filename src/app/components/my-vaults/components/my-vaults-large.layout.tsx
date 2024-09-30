import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

import { breakpoints } from '@shared/utils';

export function MyVaultsLargeLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack
      px={'25px'}
      w={breakpoints}
      h={'625px'}
      bg={'background.container.01'}
      border={'1px solid'}
      borderRadius={'md'}
      borderColor={'white.03'}
    >
      {children}
    </VStack>
  );
}
