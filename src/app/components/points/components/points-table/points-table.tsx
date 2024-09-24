import { Skeleton, useBreakpointValue } from '@chakra-ui/react';
import { GenericTableBody } from '@components/generic-table/components/generic-table-body';
import { GenericTableHeader } from '@components/generic-table/components/generic-table-header';
import { GenericTableHeaderText } from '@components/generic-table/components/generic-table-header-text';
import { GenericTableLayout } from '@components/generic-table/components/generic-table-layout';

import { PointsTableItem } from './components/points-table-item';

interface PointsTableProps {
  items?: any[];
}

export function PointsTable({ items }: PointsTableProps): React.JSX.Element {
  const dynamicHeight = items ? items.length * 65 + 20 : 20;
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <GenericTableLayout height={`${dynamicHeight}px`} width={isMobile ? '100%' : '50%'}>
      <GenericTableHeader>
        <GenericTableHeaderText w={'25%'}>dlcBTC Used</GenericTableHeaderText>
        <GenericTableHeaderText w={'50%'}>Points Earned</GenericTableHeaderText>
        <GenericTableHeaderText w={'25%'}>DeFi Protocol</GenericTableHeaderText>
      </GenericTableHeader>
      <Skeleton isLoaded={items !== undefined} height={'50px'} w={'100%'}>
        <GenericTableBody>
          {items?.map(item => <PointsTableItem key={item.name} {...item} />)}
        </GenericTableBody>
      </Skeleton>
    </GenericTableLayout>
  );
}
