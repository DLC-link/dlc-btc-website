import { Skeleton } from '@chakra-ui/react';
import { GenericTableBody } from '@components/generic-table/components/generic-table-body';
import { GenericTableHeader } from '@components/generic-table/components/generic-table-header';
import { GenericTableHeaderText } from '@components/generic-table/components/generic-table-header-text';
import { GenericTableLayout } from '@components/generic-table/components/generic-table-layout';

import { MerchantDetailsTableItem } from './components/merchant-details-table-item';

interface MerchantDetailsTableProps {
  items?: any[];
}

export function MerchantDetailsTable({ items }: MerchantDetailsTableProps): React.JSX.Element {
  const dynamicHeight = items ? items.length * 65 + 20 : 20;

  return (
    <GenericTableLayout height={`${dynamicHeight}px`}>
      <GenericTableHeader>
        <GenericTableHeaderText>Order Book</GenericTableHeaderText>
        <GenericTableHeaderText>Amount</GenericTableHeaderText>
        <GenericTableHeaderText>in USD</GenericTableHeaderText>
        <GenericTableHeaderText>Transaction</GenericTableHeaderText>
        <GenericTableHeaderText>Date</GenericTableHeaderText>
      </GenericTableHeader>
      <Skeleton isLoaded={items !== undefined} height={'50px'} w={'100%'}>
        <GenericTableBody>
          {items?.map(item => <MerchantDetailsTableItem key={item.id} {...item} />)}
        </GenericTableBody>
      </Skeleton>
    </GenericTableLayout>
  );
}
