import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function MerchantTableLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack
      w={'50%'}
      h={'250px'}
      px={'15px'}
      alignItems={'flex-start'}
      borderRadius={'md'}
      bg={'background.container.01'}
    >
      {children}
    </VStack>
  );
}
