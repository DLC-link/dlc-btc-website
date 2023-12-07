import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function UnmintLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack
      alignContent={'start'}
      alignItems={'start'}
      justifyContent={'space-between'}
      pt={'25px'}
      h={'auto'}
      w={'100%'}
      spacing={'25px'}
    >
      {children}
    </VStack>
  );
}
