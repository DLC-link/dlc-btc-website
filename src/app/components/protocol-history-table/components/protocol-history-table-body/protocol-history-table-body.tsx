import { VStack } from '@chakra-ui/react';
import { scrollBarCSS } from '@styles/css-styles';

import { exampleProtocolHistoryItems } from '@shared/examples/example-protocol-history-table-items';

import { ProtocolHistoryTableItem } from '../protocol-history-table-item';

export function ProtocolHistoryTableBody(): React.JSX.Element {
  return (
    <VStack
      w={'100%'}
      pb={'15px'}
      pr={'15px'}
      alignItems={'start'}
      overflowY={'scroll'}
      overflowX={'hidden'}
      css={scrollBarCSS}
    >
      {exampleProtocolHistoryItems.map(item => (
        <ProtocolHistoryTableItem key={item.id} {...item} />
      ))}
    </VStack>
  );
}
