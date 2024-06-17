import { HStack, Text } from '@chakra-ui/react';

import { AttestorDetailsCardLayout } from './components/attestor-details-card/attestor-details-card-layout';
import { AttestorDetailsDonutChart } from './components/attestor-details-card/attestor-details-donut-chart';
import { AttestorDetailsRateCardContent } from './components/attestor-details-card/attestor-details-rate-card-content';
import { AttestorDetailsValidatorsCardContent } from './components/attestor-details-card/attestor-details-validators-card-content';
import { AttestorDetailsLayout } from './components/attestor-details-layout';
import { AttestorDetailsTable } from './components/attestor-details-table/attestor-details-table';

export const donutData = [
  { name: 'Mark', value: 90 },
  { name: 'Robert', value: 12 },
  { name: 'Emily', value: 34 },
  { name: 'Marion', value: 53 },
  { name: 'Nicolas', value: 98 },
];

export function AttestorDetails(): React.JSX.Element {
  return (
    <AttestorDetailsLayout>
      <Text w={'100%'} color={'white'} fontSize={'6xl'} fontWeight={500}>
        dlcBTC Attestor Details
      </Text>
      <HStack spacing={'20px'}>
        <AttestorDetailsCardLayout width={'310px'}>
          {<AttestorDetailsValidatorsCardContent />}
        </AttestorDetailsCardLayout>
        <AttestorDetailsCardLayout width={'620px'}>
          {<AttestorDetailsRateCardContent width={'280px'} />}
        </AttestorDetailsCardLayout>
        <AttestorDetailsCardLayout width={'310px'}>
          <AttestorDetailsDonutChart width={300} height={300} data={donutData} />
        </AttestorDetailsCardLayout>
      </HStack>
      <AttestorDetailsTable />
    </AttestorDetailsLayout>
  );
}
