import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function RiskBoxLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack w={'100%'} alignItems={'flex-start'} gap={'0px'}>
      {children}
    </VStack>
  );
}
