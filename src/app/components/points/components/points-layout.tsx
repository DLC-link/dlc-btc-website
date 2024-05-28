import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function PointsLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack w={'1280px'} spacing={'20px'}>
      {children}
    </VStack>
  );
}
