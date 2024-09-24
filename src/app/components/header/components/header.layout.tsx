import { HStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

import { breakpoints } from '@shared/utils';

export function HeaderLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <HStack justifyContent={'space-between'} w={breakpoints}>
      {children}
    </HStack>
  );
}
