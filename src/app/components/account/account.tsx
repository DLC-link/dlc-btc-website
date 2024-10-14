import { useContext } from 'react';
import { useDispatch } from 'react-redux';

import { Button, HStack } from '@chakra-ui/react';
import { AccountMenu } from '@components/account/components/account-menu';
import { RippleWallet } from '@components/modals/select-wallet-modal/select-wallet-modal';
import { useNetworkConnection } from '@hooks/use-connected';
import { NetworkConfigurationContext } from '@providers/network-configuration.provider';
import { RippleNetworkConfigurationContext } from '@providers/ripple-network-configuration.provider';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { modalActions } from '@store/slices/modal/modal.actions';
import { Connector, useAccount, useDisconnect } from 'wagmi';

export function Account(): React.JSX.Element {
  const dispatch = useDispatch();

  const { isConnected } = useNetworkConnection();
  const { networkType } = useContext(NetworkConfigurationContext);

  const { address: ethereumUserAddress, connector: ethereumWallet } = useAccount();
  const { disconnect: disconnectEthereumWallet } = useDisconnect();
  const { rippleUserAddress, rippleWallet } = useContext(RippleNetworkConfigurationContext);

  function getWalletInformation():
    | { address: string; wallet: RippleWallet | Connector }
    | undefined {
    switch (networkType) {
      case 'evm':
        if (!ethereumUserAddress || !ethereumWallet) return undefined;
        return { address: ethereumUserAddress, wallet: ethereumWallet };
      case 'xrpl':
        if (!rippleUserAddress) return undefined;
        return { address: rippleUserAddress, wallet: rippleWallet! };
      default:
        throw new Error('Invalid Network Type');
    }
  }

  function onConnectWalletClick(): void {
    dispatch(modalActions.toggleSelectWalletModalVisibility());
  }

  function onDisconnectWalletClick(): void {
    // switch (networkType) {
    //   case 'evm':
    //     disconnectEthereumWallet();
    //     break;
    //   case 'xrpl':
    //     setIsRippleWalletConnected(false);
    //     break;
    //   default:
    //     break;
    // }
    // dispatch(mintUnmintActions.resetMintUnmintState());
  }

  return (
    <HStack w={'275px'}>
      {isConnected ? (
        <AccountMenu
          address={getWalletInformation()?.address}
          wallet={getWalletInformation()?.wallet}
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
