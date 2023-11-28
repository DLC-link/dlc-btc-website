import { TransactionSummary } from "@components/mint-unmint/components/transaction-summary/transaction-summary";

import { ModalComponentProps } from "../components/modal-container";
import { ModalLayout } from "../components/modal.layout";

interface SuccessfulFlowModalProps extends ModalComponentProps {
  flow: "mint" | "unmint";
}

export function SuccessfulFlowModal({
  isOpen,
  handleClose,
  flow,
}: SuccessfulFlowModalProps): React.JSX.Element {
  return (
    <ModalLayout
      title={"Success!"}
      isOpen={isOpen}
      onClose={() => handleClose()}
    >
      <TransactionSummary
        currentStep={flow === "mint" ? 3 : 2}
        flow={flow}
        blockchain={"ethereum"}
      />
    </ModalLayout>
  );
}
