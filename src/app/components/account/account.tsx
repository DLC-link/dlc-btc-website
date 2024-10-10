import { useContext } from 'react';
import { useDispatch } from 'react-redux';

import { Button, HStack } from '@chakra-ui/react';
import { AccountMenu } from '@components/account/components/account-menu';
import { RippleWalletContext } from '@providers/ripple-user-wallet-context-provider';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { modalActions } from '@store/slices/modal/modal.actions';

// import { modalActions } from '@store/slices/modal/modal.actions';
// import { useAccount, useDisconnect } from 'wagmi';

export function Account(): React.JSX.Element {
  const dispatch = useDispatch();

  // const { address, connector } = useAccount();
  // const { disconnect } = useDisconnect();
  const { isRippleWalletInitialized, resetRippleWallet } = useContext(RippleWalletContext);

  function onConnectWalletClick(): void {
    dispatch(modalActions.toggleSelectWalletModalVisibility());
  }

  function onDisconnectWalletClick(): void {
    resetRippleWallet();
    dispatch(mintUnmintActions.resetMintUnmintState());
  }

  return (
    <HStack w={'275px'}>
      {isRippleWalletInitialized ? (
        <AccountMenu
          // address={address}
          // wagmiConnector={connector}
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
