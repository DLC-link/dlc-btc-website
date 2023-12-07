import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function MyVaultsSmallLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack
      py={'2.5px'}
      px={'25px'}
      w={'350px'}
      h={'625px'}
      bg={'background.container.01'}
      border={'1px solid'}
      borderRadius={'md'}
      borderColor={'border.cyan.01'}
    >
      {children}
    </VStack>
  );
}
