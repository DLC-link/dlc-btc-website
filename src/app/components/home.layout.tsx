import { Stack } from '@chakra-ui/react';

import { HasChildren } from '../../shared/models/has-children';

export function AppLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <Stack py={['5%', '1.5%']}>
      {children}
    </Stack>
  );
}
