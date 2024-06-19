import { exampleAttestorDetailsTableItems } from '@shared/examples/example-attestor-details-table-items';

import { AttestorDetailsTableBody } from './components/attestor-details-table-body/attestor-details-table-body';
import { AttestorDetailsTableHeader } from './components/attestor-details-table-header/attestor-details-table-header';
import { AttestorDetailsTableHeaderText } from './components/attestor-details-table-header/attestor-details-table-header-text';
import { AttestorDetailsTableItem } from './components/attestor-details-table-item';
import { AttestorDetailsTableLayout } from './components/attestor-details-table-layout';

export function AttestorDetailsTable(): React.JSX.Element {
  return (
    <AttestorDetailsTableLayout>
      <AttestorDetailsTableHeader
        children={
          <>
            <AttestorDetailsTableHeaderText width={'20%'}>Node</AttestorDetailsTableHeaderText>
            <AttestorDetailsTableHeaderText width={'15%'}>
              Observed Response
            </AttestorDetailsTableHeaderText>
            <AttestorDetailsTableHeaderText width={'10%'}>
              Total Stake
            </AttestorDetailsTableHeaderText>
            <AttestorDetailsTableHeaderText width={'5%'}>Del.</AttestorDetailsTableHeaderText>
            <AttestorDetailsTableHeaderText width={'5%'}>Fee</AttestorDetailsTableHeaderText>
            <AttestorDetailsTableHeaderText width={'10%'}>
              Comulative Stake
            </AttestorDetailsTableHeaderText>
            <AttestorDetailsTableHeaderText width={'10%'}>Max Yield</AttestorDetailsTableHeaderText>
            <AttestorDetailsTableHeaderText width={'15%'}>
              Start Date
            </AttestorDetailsTableHeaderText>
          </>
        }
      />
      <AttestorDetailsTableBody
        children={
          <>
            {exampleAttestorDetailsTableItems.map(item => (
              <AttestorDetailsTableItem key={item.node} {...item} />
            ))}
          </>
        }
      />
    </AttestorDetailsTableLayout>
  );
}
