import { useContext } from 'react';

import { VStack } from '@chakra-ui/react';
import { ModalComponentProps } from '@components/modals/components/modal-container';
import { ModalLayout } from '@components/modals/components/modal.layout';
import { BitcoinWalletType, bitcoinWallets } from '@models/wallet';
import {
  BitcoinWalletContext,
  BitcoinWalletContextState,
} from '@providers/ledger-context-provider';

import { SelectBitcoinWalletMenu } from './components/select-bitcoin-wallet-modal-menu';

export function SelectBitcoinWalletModal({
  isOpen,
  handleClose,
}: ModalComponentProps): React.JSX.Element {
  const { setBitcoinWalletType, setBitcoinWalletContextState } = useContext(BitcoinWalletContext);

  function handleLogin(walletType: BitcoinWalletType) {
    setBitcoinWalletType(walletType);
    setBitcoinWalletContextState(BitcoinWalletContextState.SELECT_BITCOIN_WALLET_READY);
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
