import { HStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function ProtocolSummaryStackLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <HStack w={'50%'} spacing={'25px'}>
      {children}
    </HStack>
  );
}
