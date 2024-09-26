import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function RiskBoxLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack
      alignContent={'flex-start'}
      p={'15px'}
      bgColor={'none'}
      border={'1px solid'}
      borderColor={'white.03'}
      borderRadius={'md'}
    >
      {children}
    </VStack>
  );
}
