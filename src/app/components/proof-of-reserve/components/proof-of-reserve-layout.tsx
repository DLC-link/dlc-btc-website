import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function ProofOfReserveLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack w={'100%'} spacing={'20px'}>
      {children}
    </VStack>
  );
}
