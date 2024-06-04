import { useDispatch } from 'react-redux';

import { VStack, useToast } from '@chakra-ui/react';
import { ModalComponentProps } from '@components/modals/components/modal-container';
import { ModalLayout } from '@components/modals/components/modal.layout';
import { useLeather } from '@hooks/use-leather';
import { BitcoinWalletType, bitcoinWallets } from '@models/wallet';
import { modalActions } from '@store/slices/modal/modal.actions';

import { SelectBitcoinWalletMenu } from './components/select-bitcoin-wallet-modal-menu';

export function SelectBitcoinWalletModal({
  isOpen,
  handleClose,
}: ModalComponentProps): React.JSX.Element {
  const dispatch = useDispatch();
  const toast = useToast();
  const { connectLeatherWallet } = useLeather();

  async function handleLogin(walletType: BitcoinWalletType) {
    switch (walletType) {
      case BitcoinWalletType.Leather:
        try {
          await connectLeatherWallet();
        } catch (error: any) {
          toast({
            title: 'Failed to sign transaction',
            description: error.message,
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
        break;
      case BitcoinWalletType.Ledger:
        dispatch(modalActions.toggleLedgerModalVisibility());
        break;
      default:
        break;
    }
    handleClose();
  }

  return (
    <ModalLayout title="Connect Bitcoin Wallet" isOpen={isOpen} onClose={() => handleClose()}>
      <VStack alignItems={'start'} spacing={'25px'}>
        {bitcoinWallets.map(wallet => (
          <SelectBitcoinWalletMenu
            key={wallet.name}
            wallet={wallet}
            handleClick={() => handleLogin(wallet.id)}
          />
        ))}
      </VStack>
    </ModalLayout>
  );
}
