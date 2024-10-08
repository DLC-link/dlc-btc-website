import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, HStack } from '@chakra-ui/react';
import { AccountMenu } from '@components/account/components/account-menu';
import { NetworkConfigurationContext } from '@providers/network-configuration.provider';
import { RippleNetworkConfigurationContext } from '@providers/ripple-network-configuration.provider';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { modalActions } from '@store/slices/modal/modal.actions';
import { useAccount, useDisconnect } from 'wagmi';

export function Account(): React.JSX.Element {
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(false);

  const { address, connector, isConnected: isEthereumWalletConnected } = useAccount();
  const { isRippleWalletConnected, setIsRippleWalletConnected } = useContext(
    RippleNetworkConfigurationContext
  );
  const { networkType } = useContext(NetworkConfigurationContext);
  useEffect(() => {
    if (networkType === 'evm') {
      setIsConnected(isEthereumWalletConnected);
    } else {
      setIsConnected(isRippleWalletConnected);
    }
  }, [isEthereumWalletConnected, isRippleWalletConnected, networkType]);
  const { disconnect } = useDisconnect();

  function onConnectWalletClick(): void {
    dispatch(modalActions.toggleSelectWalletModalVisibility());
  }

  function onDisconnectWalletClick(): void {
    if (networkType === 'evm') {
      disconnect();
    } else {
      setIsRippleWalletConnected(false);
    }
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
