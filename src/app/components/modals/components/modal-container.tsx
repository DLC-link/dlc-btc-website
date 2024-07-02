import { useDispatch, useSelector } from 'react-redux';

import { SelectWalletModal } from '@components/modals/select-wallet-modal/select-wallet-modal';
import { AnyAction } from '@reduxjs/toolkit';
import { RootState } from '@store/index';
import { modalActions } from '@store/slices/modal/modal.actions';

import { LedgerModal } from '../ledger-modal/ledger-modal';
import { SelectBitcoinWalletModal } from '../select-bitcoin-wallet-modal/select-bitcoin-wallet-modal';
import { SuccessfulFlowModal } from '../successful-flow-modal/successful-flow-modal';

export interface ModalComponentProps {
  isOpen: boolean;
  handleClose: () => void;
}

export function ModalContainer(): React.JSX.Element {
  const dispatch = useDispatch();
  const {
    isSelectWalletModalOpen,
    isSuccesfulFlowModalOpen,
    isSelectBitcoinWalletModalOpen,
    isLedgerModalOpen,
  } = useSelector((state: RootState) => state.modal);

  const handleClosingModal = (actionCreator: () => AnyAction) => {
    dispatch(actionCreator());
  };

  return (
    <>
      <SelectWalletModal
        isOpen={isSelectWalletModalOpen}
        handleClose={() => handleClosingModal(modalActions.toggleSelectWalletModalVisibility)}
      />
      <SuccessfulFlowModal
        isOpen={isSuccesfulFlowModalOpen[0]}
        handleClose={() =>
          handleClosingModal(() =>
            modalActions.toggleSuccessfulFlowModalVisibility({ vaultUUID: '' })
          )
        }
        vaultUUID={isSuccesfulFlowModalOpen[1] ? isSuccesfulFlowModalOpen[1] : ''}
      />
      <SelectBitcoinWalletModal
        isOpen={isSelectBitcoinWalletModalOpen}
        handleClose={() =>
          handleClosingModal(modalActions.toggleSelectBitcoinWalletModalVisibility)
        }
      />
      <LedgerModal
        isOpen={isLedgerModalOpen}
        handleClose={() => handleClosingModal(modalActions.toggleLedgerModalVisibility)}
      />
    </>
  );
}
