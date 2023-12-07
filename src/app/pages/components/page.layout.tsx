import { HStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function PageLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <HStack justifyContent={'center'} w={'1280px'} pt={'75px'} pb={'0px'} spacing={'20px'}>
      {children}
    </HStack>
  );
}
