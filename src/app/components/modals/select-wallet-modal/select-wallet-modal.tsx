import { useDispatch, useSelector } from 'react-redux';

import { VStack } from '@chakra-ui/react';

import { wallets } from '../../../../shared/models/wallet';
import { RootState } from '../../../store';
import { modalActions } from '../../../store/slices/component/modal.actions';
import { ModalLayout } from '../components/modal.layout';
import { WalletButton } from './components/wallet-button';

export function SelectWalletModal(): React.JSX.Element {
  const dispatch = useDispatch();
  const { isSelectWalletModalOpen } = useSelector((state: RootState) => state.modal);

  return (
    <ModalLayout
      title="Select Wallet"
      isOpen={isSelectWalletModalOpen}
      onClose={() => dispatch(modalActions.toggleSelectWalletModalVisibility(false))}
    >
      <VStack>
        {wallets.map(wallet => {
          return <WalletButton key={wallet.name} wallet={wallet} />;
        })}
      </VStack>
    </ModalLayout>
  );
}
