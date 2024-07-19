import { useContext, useState } from 'react';

import { CheckIcon } from '@chakra-ui/icons';
import { HStack, ScaleFade, Text, VStack } from '@chakra-ui/react';
import { ModalComponentProps } from '@components/modals/components/modal-container';
import { ModalLayout } from '@components/modals/components/modal.layout';
import { SelectWalletMenu } from '@components/modals/select-wallet-modal/components/select-wallet-menu';
import { SelectNetworkButton } from '@components/select-network-button/select-network-button';
import { WalletType, ethereumWallets } from '@models/wallet';
import { EthereumHandlerContext } from '@providers/ethereum-handler-context-provider';
import { EthereumNetwork } from 'dlc-btc-lib/models';

export function SelectWalletModal({ isOpen, handleClose }: ModalComponentProps): React.JSX.Element {
  const { getEthereumHandler } = useContext(EthereumHandlerContext);

  const [currentNetwork, setCurrentNetwork] = useState<EthereumNetwork | undefined>(undefined);

  async function handleLogin(walletType: WalletType) {
    if (!currentNetwork) throw new Error('No network selected');
    await getEthereumHandler(walletType, currentNetwork);
    setCurrentNetwork(undefined);
    handleClose();
  }

  const handleNetworkChange = (currentNetwork: EthereumNetwork) => {
    setCurrentNetwork(currentNetwork);
  };

  return (
    <ModalLayout title="Connect Wallet" isOpen={isOpen} onClose={() => handleClose()}>
      <VStack alignItems={'start'} spacing={'25px'}>
        {!currentNetwork ? (
          <Text variant={'header'}>Select Network</Text>
        ) : (
          <HStack>
            <Text variant={'header'}>Network Selected</Text>
            <CheckIcon color={'accent.lightBlue.01'} />
          </HStack>
        )}
        <SelectNetworkButton handleClick={handleNetworkChange} currentNetwork={currentNetwork} />
        <ScaleFade in={!!currentNetwork} transition={{ enter: { delay: 0.15 } }} unmountOnExit>
          <VStack alignItems={'start'} spacing={'25px'}>
            <Text variant={'header'}>Select Wallet</Text>
            {ethereumWallets.map(wallet => (
              <SelectWalletMenu
                key={wallet.name}
                wallet={wallet}
                handleClick={() => handleLogin(wallet.id)}
              />
            ))}
          </VStack>
        </ScaleFade>
      </VStack>
    </ModalLayout>
  );
}
