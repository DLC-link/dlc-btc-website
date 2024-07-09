import { VStack } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function GenericTableBody({ children }: HasChildren): React.JSX.Element {
  return <VStack w={'100%'}>{children}</VStack>;
}
