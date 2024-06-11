import { HStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function RiskBoxLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <HStack p={'7.5px'} pr={'25px'} w={'100%'} justifyContent={'space-between'}>
      {children}
    </HStack>
  );
}
