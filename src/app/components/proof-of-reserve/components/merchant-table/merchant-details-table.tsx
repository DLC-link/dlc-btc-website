import { Skeleton, Text } from '@chakra-ui/react';
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
        <GenericTableHeaderText w={'15%'}>Order Book</GenericTableHeaderText>
        <GenericTableHeaderText w={'15%'}>Amount</GenericTableHeaderText>
        {/* <GenericTableHeaderText>in USD</GenericTableHeaderText> */}
        <GenericTableHeaderText w={'15%'}>Transaction</GenericTableHeaderText>
        <GenericTableHeaderText w={'15%'}>Chain</GenericTableHeaderText>
        <GenericTableHeaderText w={'15%'}>Date</GenericTableHeaderText>
      </GenericTableHeader>
      <Skeleton isLoaded={items !== undefined} height={'50px'} w={'100%'}>
        {items?.length === 0 && (
          <Text color={'white'} p={'10px'}>
            No Transaction History to show.
          </Text>
        )}
        <GenericTableBody>
          {items?.map(item => <MerchantDetailsTableItem key={item.id} {...item} />)}
        </GenericTableBody>
      </Skeleton>
    </GenericTableLayout>
  );
}
