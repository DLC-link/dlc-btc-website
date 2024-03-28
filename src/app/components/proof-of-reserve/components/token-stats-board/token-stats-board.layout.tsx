import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function TokenStatsBoardLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack
      w={'1280px'}
      h={'250px'}
      px={'15px'}
      borderRadius={'md'}
      bg={'background.container.01'}
      alignItems={'flex-start'}
    >
      {children}
    </VStack>
  );
}
