import { Stack } from '@chakra-ui/react';

import { HasChildren } from '../../../common/has-children';

export function HomeLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <Stack>
      {children}
    </Stack>
  );
}
