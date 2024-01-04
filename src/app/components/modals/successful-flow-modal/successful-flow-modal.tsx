import { TransactionSummary } from '@components/mint-unmint/components/transaction-summary/transaction-summary';

import { ModalComponentProps } from '../components/modal-container';
import { ModalLayout } from '../components/modal.layout';

interface SuccessfulFlowModalProps extends ModalComponentProps {
  flow: 'mint' | 'unmint';
  vaultUUID: string;
}

export function SuccessfulFlowModal({
  isOpen,
  handleClose,
  flow,
  vaultUUID,
}: SuccessfulFlowModalProps): React.JSX.Element {
  return (
    <ModalLayout title={'Success!'} isOpen={isOpen} onClose={() => handleClose()}>
      <TransactionSummary
        currentStep={[flow === 'mint' ? 4 : 3, vaultUUID]}
        flow={flow}
        blockchain={'ethereum'}
        handleClose={() => handleClose()}
      />
    </ModalLayout>
  );
}
