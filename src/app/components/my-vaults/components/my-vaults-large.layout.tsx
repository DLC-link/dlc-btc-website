import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function MyVaultsLargeLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack
      px={'25px'}
      w={'1280px'}
      h={'625px'}
      bg={'background.container.01'}
      border={'1px solid'}
      borderRadius={'md'}
      borderColor={'border.lightBlue.01'}
    >
      {children}
    </VStack>
  );
}
