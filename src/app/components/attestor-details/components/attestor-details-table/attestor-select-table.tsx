import { exampleAttestorSelectTableItems } from '@shared/examples/example-attestor-select-table-items';

import { AttestorDetailsTableBody } from './components/attestor-details-table-body/attestor-details-table-body';
import { AttestorDetailsTableHeader } from './components/attestor-details-table-header/attestor-details-table-header';
import { AttestorDetailsTableHeaderText } from './components/attestor-details-table-header/attestor-details-table-header-text';
import { AttestorDetailsTableLayout } from './components/attestor-details-table-layout';
import { AttestorSelectTableItem } from './components/attestor-select-table-item';

export function AttestorSelectTable(): React.JSX.Element {
  return (
    <AttestorDetailsTableLayout>
      <AttestorDetailsTableHeader>
        <>
          <AttestorDetailsTableHeaderText width={'20%'}>#</AttestorDetailsTableHeaderText>
          <AttestorDetailsTableHeaderText width={'16%'}>Time</AttestorDetailsTableHeaderText>
          <AttestorDetailsTableHeaderText width={'16%'}>Action</AttestorDetailsTableHeaderText>
          <AttestorDetailsTableHeaderText width={'16%'}>Programs</AttestorDetailsTableHeaderText>
          <AttestorDetailsTableHeaderText width={'16%'}>Value</AttestorDetailsTableHeaderText>
          <AttestorDetailsTableHeaderText width={'16%'}>Tokens</AttestorDetailsTableHeaderText>
        </>
      </AttestorDetailsTableHeader>

      <AttestorDetailsTableBody>
        <>
          {exampleAttestorSelectTableItems.map(item => (
            <AttestorSelectTableItem key={item.hash} {...item} />
          ))}
        </>
      </AttestorDetailsTableBody>
    </AttestorDetailsTableLayout>
  );
}
