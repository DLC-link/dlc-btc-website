import { ProtocolHistoryTableBody } from './components/protocol-history-table-body/protocol-history-table-body';
import { ProtocolHistoryTableHeader } from './components/protocol-history-table-header/protocol-history-table-header';
import { ProtocolHistoryLayout } from './components/protocol-history-table.layout';

// @ts-expect-error: ignoring because of later implementation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ProtocolHistoryTable(): React.JSX.Element {
  return (
    <ProtocolHistoryLayout>
      <ProtocolHistoryTableHeader />
      <ProtocolHistoryTableBody />
    </ProtocolHistoryLayout>
  );
}
