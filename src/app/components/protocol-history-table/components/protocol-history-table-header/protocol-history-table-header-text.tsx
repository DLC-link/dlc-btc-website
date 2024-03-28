import React from 'react';

import { Text } from '@chakra-ui/react';
import { HasChildren } from '@models/has-children';

export function ProtocolHistoryTableHeaderText({ children }: HasChildren): React.JSX.Element {
  return (
    <Text w={'25%'} color={'white'} fontSize={'sm'}>
      {children}
    </Text>
  );
}
