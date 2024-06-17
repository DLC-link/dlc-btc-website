import { AttestorDetailsTableBody } from './components/attestor-details-table-body/attestor-details-table-body';
import { AttestorDetailsTableHeader } from './components/attestor-details-table-header/attestor-details-table-header';
import { AttestorDetailsTableLayout } from './components/attestor-details-table-layout';

export function AttestorDetailsTable(): React.JSX.Element {
  return (
    <AttestorDetailsTableLayout>
      <AttestorDetailsTableHeader />
      <AttestorDetailsTableBody />
    </AttestorDetailsTableLayout>
  );
}
