import { useDispatch } from 'react-redux';

import { Button, HStack } from '@chakra-ui/react';
import { AccountMenu } from '@components/account/components/account-menu';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { modalActions } from '@store/slices/modal/modal.actions';
import { useAccount, useDisconnect } from 'wagmi';

export function Account(): React.JSX.Element {
  const dispatch = useDispatch();

  const { address, connector, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  function onConnectWalletClick(): void {
    dispatch(modalActions.toggleSelectWalletModalVisibility());
  }

  function onDisconnectWalletClick(): void {
    disconnect();
    dispatch(mintUnmintActions.resetMintUnmintState());
  }

  return (
    <HStack w={'275px'}>
      {isConnected ? (
        <AccountMenu
          address={address}
          wagmiConnector={connector}
          handleDisconnectWallet={() => onDisconnectWalletClick()}
        />
      ) : (
        <Button variant={'account'} onClick={() => onConnectWalletClick()}>
          Connect Wallet
        </Button>
      )}
    </HStack>
  );
}
