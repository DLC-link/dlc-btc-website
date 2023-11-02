import { HStack } from '@chakra-ui/react';

import { HasChildren } from '../../../common/has-children';

export function HeaderLayout({ children }: HasChildren): React.JSX.Element {
  return <HStack justifyContent={'space-between'}>{children}</HStack>;
}
