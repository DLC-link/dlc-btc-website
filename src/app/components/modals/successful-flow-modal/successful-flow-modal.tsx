import { TransactionSummary } from '@components/mint-unmint/components/transaction-summary/transaction-summary';

import { ModalComponentProps } from '../components/modal-container';
import { ModalLayout } from '../components/modal.layout';

interface SuccessfulFlowModalProps extends ModalComponentProps {
  vaultUUID: string;
}

export function SuccessfulFlowModal({
  isOpen,
  handleClose,
  vaultUUID,
}: SuccessfulFlowModalProps): React.JSX.Element {
  return (
    <ModalLayout title={'Success!'} isOpen={isOpen} onClose={() => handleClose()}>
      <TransactionSummary
        currentStep={[3, vaultUUID]}
        flow={'mint'}
        blockchain={'ethereum'}
        width="100%"
        handleClose={() => handleClose()}
      />
    </ModalLayout>
  );
}
