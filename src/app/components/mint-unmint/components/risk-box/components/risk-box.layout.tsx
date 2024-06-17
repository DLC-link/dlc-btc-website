import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function RiskBoxLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack p={'7.5px'} pr={'25px'} w={'100%'} alignItems={'flex-start'}>
      {children}
    </VStack>
  );
}
