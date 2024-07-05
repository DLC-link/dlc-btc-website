import { HStack } from '@chakra-ui/react';

import { ProtocolHistoryTableHeaderText } from './protocol-history-table-header-text';

export function ProtocolHistoryTableHeader(): React.JSX.Element {
  return (
    <HStack w={'95%'} pl={'10px'}>
      <ProtocolHistoryTableHeaderText>Order Book</ProtocolHistoryTableHeaderText>
      <ProtocolHistoryTableHeaderText>Merchant</ProtocolHistoryTableHeaderText>
      <ProtocolHistoryTableHeaderText>BTC Transaction</ProtocolHistoryTableHeaderText>
      <ProtocolHistoryTableHeaderText>Date</ProtocolHistoryTableHeaderText>
    </HStack>
  );
}
