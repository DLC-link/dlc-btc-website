import { useDispatch } from 'react-redux';

import { Button, HStack, useBreakpointValue } from '@chakra-ui/react';
import { AccountMenu } from '@components/account/components/account-menu';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { modalActions } from '@store/slices/modal/modal.actions';
import { useAccount, useDisconnect } from 'wagmi';

export function Account(): React.JSX.Element {
  const dispatch = useDispatch();

  const { address, connector, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const isMobile = useBreakpointValue({ base: true, md: false });

  function onConnectWalletClick(): void {
    dispatch(modalActions.toggleSelectWalletModalVisibility());
  }

  function onDisconnectWalletClick(): void {
    disconnect();
    dispatch(mintUnmintActions.resetMintUnmintState());
  }

  return (
    <HStack h={isMobile ? '40px' : '50px'}>
      {isConnected ? (
        <AccountMenu
          address={address}
          wagmiConnector={connector}
          handleDisconnectWallet={() => onDisconnectWalletClick()}
        />
      ) : (
        <Button
          variant={'account'}
          onClick={() => onConnectWalletClick()}
          h={isMobile ? '40px' : '50px'}
          w={isMobile ? '150px' : '275px'}
          fontSize={isMobile ? 'md' : 'lg'}
        >
          Connect Wallet
        </Button>
      )}
    </HStack>
  );
}
