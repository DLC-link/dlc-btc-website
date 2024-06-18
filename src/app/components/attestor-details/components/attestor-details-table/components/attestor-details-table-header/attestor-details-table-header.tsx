import { HStack } from '@chakra-ui/react';

import { AttestorDetailsTableHeaderText } from './attestor-details-table-header-text';

export function AttestorDetailsTableHeader(): React.JSX.Element {
  return (
    <HStack w={'98%'} px={'10px'} justifyContent={'space-between'}>
      <AttestorDetailsTableHeaderText width={'20%'}>Node</AttestorDetailsTableHeaderText>
      <AttestorDetailsTableHeaderText width={'15%'}>
        Observed Response
      </AttestorDetailsTableHeaderText>
      <AttestorDetailsTableHeaderText width={'10%'}>Total Stake</AttestorDetailsTableHeaderText>
      <AttestorDetailsTableHeaderText width={'5%'}>Del.</AttestorDetailsTableHeaderText>
      <AttestorDetailsTableHeaderText width={'5%'}>Fee</AttestorDetailsTableHeaderText>
      <AttestorDetailsTableHeaderText width={'10%'}>
        Comulative Stake
      </AttestorDetailsTableHeaderText>
      <AttestorDetailsTableHeaderText width={'10%'}>Max Yield</AttestorDetailsTableHeaderText>
      <AttestorDetailsTableHeaderText width={'15%'}>Start Date</AttestorDetailsTableHeaderText>
    </HStack>
  );
}
