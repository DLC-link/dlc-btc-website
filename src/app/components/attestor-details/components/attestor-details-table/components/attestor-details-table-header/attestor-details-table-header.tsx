import { HStack } from '@chakra-ui/react';

import { AttestorDetailsTableHeaderText } from './attestor-details-table-header-text';

export function AttestorDetailsTableHeader(): React.JSX.Element {
  return (
    <HStack w={'95%'} pl={'10px'}>
      <AttestorDetailsTableHeaderText>Node</AttestorDetailsTableHeaderText>
      <AttestorDetailsTableHeaderText>Observed Response</AttestorDetailsTableHeaderText>
      <AttestorDetailsTableHeaderText>Total Stake</AttestorDetailsTableHeaderText>
      <AttestorDetailsTableHeaderText>Del.</AttestorDetailsTableHeaderText>
      <AttestorDetailsTableHeaderText>Fee</AttestorDetailsTableHeaderText>
      <AttestorDetailsTableHeaderText>Comulative Stake</AttestorDetailsTableHeaderText>
      <AttestorDetailsTableHeaderText>Max Yield</AttestorDetailsTableHeaderText>
      <AttestorDetailsTableHeaderText>Start Date</AttestorDetailsTableHeaderText>
    </HStack>
  );
}
