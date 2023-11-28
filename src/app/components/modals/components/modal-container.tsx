import { useDispatch, useSelector } from "react-redux";

import { SelectWalletModal } from "@components/modals/select-wallet-modal/select-wallet-modal";
import { AnyAction } from "@reduxjs/toolkit";
import { RootState } from "@store/index";
import { modalActions } from "@store/slices/modal/modal.actions";

import { SuccessfulFlowModal } from "../successful-flow-modal/successful-flow-modal";

export interface ModalComponentProps {
  isOpen: boolean;
  handleClose: () => void;
}

export function ModalContainer(): React.JSX.Element {
  const dispatch = useDispatch();
  const { isSelectWalletModalOpen, isSuccesfulFlowModalOpen } = useSelector(
    (state: RootState) => state.modal,
  );

  const handleClosingModal = (actionCreator: () => AnyAction) => {
    dispatch(actionCreator());
  };

  return (
    <>
      <SelectWalletModal
        isOpen={isSelectWalletModalOpen}
        handleClose={() =>
          handleClosingModal(modalActions.toggleSelectWalletModalVisibility)
        }
      />
      <SuccessfulFlowModal
        isOpen={isSuccesfulFlowModalOpen[0]}
        handleClose={() =>
          handleClosingModal(() =>
            modalActions.toggleSuccessfulFlowModalVisibility("mint"),
          )
        }
        flow={isSuccesfulFlowModalOpen[1]}
      />
    </>
  );
}
