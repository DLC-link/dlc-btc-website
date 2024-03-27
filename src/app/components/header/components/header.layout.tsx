import { HStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function HeaderLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <HStack justifyContent={'space-between'} w={'1280px'}>
      {children}
    </HStack>
  );
}
