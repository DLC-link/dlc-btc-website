import { Skeleton } from '@chakra-ui/react';
import { GenericTableBody } from '@components/generic-table/components/generic-table-body';
import { GenericTableHeader } from '@components/generic-table/components/generic-table-header';
import { GenericTableHeaderText } from '@components/generic-table/components/generic-table-header-text';
import { GenericTableLayout } from '@components/generic-table/components/generic-table-layout';
import { ProtocolHistoryTableItem } from '@components/protocol-history-table/components/protocol-history-table-item';

interface ProtocolHistoryTableProps {
  items?: any[];
}

export function ProtocolHistoryTable({ items }: ProtocolHistoryTableProps): React.JSX.Element {
  const dynamicHeight = items ? items.length * 59 + 20 : 20;

  return (
    <GenericTableLayout height={`${dynamicHeight}px`} width={'50%'}>
      <GenericTableHeader>
        <GenericTableHeaderText w={'25%'}>Order Book</GenericTableHeaderText>
        <GenericTableHeaderText w={'25%'}>Merchant</GenericTableHeaderText>
        <GenericTableHeaderText w={'25%'}>Transaction</GenericTableHeaderText>
        <GenericTableHeaderText w={'25%'}>Date</GenericTableHeaderText>
      </GenericTableHeader>
      <Skeleton isLoaded={items !== undefined} height={'50px'} w={'100%'}>
        <GenericTableBody>
          {items?.map(item => <ProtocolHistoryTableItem key={item.id} {...item} />)}
        </GenericTableBody>
      </Skeleton>
    </GenericTableLayout>
  );
}
