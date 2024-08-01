import { useState } from 'react';

import { CheckIcon } from '@chakra-ui/icons';
import { HStack, ScaleFade, Text, VStack } from '@chakra-ui/react';
import { ModalComponentProps } from '@components/modals/components/modal-container';
import { ModalLayout } from '@components/modals/components/modal.layout';
import { SelectWalletMenu } from '@components/modals/select-wallet-modal/components/select-wallet-menu';
import { SelectNetworkButton } from '@components/select-network-button/select-network-button';
import { Chain } from 'viem';
import { Connector, useConfig, useConnect } from 'wagmi';

export function SelectWalletModal({ isOpen, handleClose }: ModalComponentProps): React.JSX.Element {
  const { connectors, connect } = useConnect();
  const { chains } = useConfig();

  const [selectedEthereumNetwork, setSelectedEthereumNetwork] = useState<Chain | undefined>(
    undefined
  );

  async function handleConnectWallet(wagmiConnector: Connector) {
    connect({ chainId: selectedEthereumNetwork?.id, connector: wagmiConnector });
  }

  const handleChangeNetwork = (ethereumNetwork: Chain) => {
    setSelectedEthereumNetwork(ethereumNetwork);
  };

  return (
    <ModalLayout title="Connect Wallet" isOpen={isOpen} onClose={() => handleClose()}>
      <VStack alignItems={'start'} spacing={'25px'}>
        {!selectedEthereumNetwork ? (
          <Text variant={'header'}>Select Network</Text>
        ) : (
          <HStack>
            <Text variant={'header'}>Network Selected</Text>
            <CheckIcon color={'accent.lightBlue.01'} />
          </HStack>
        )}
        <SelectNetworkButton
          handleChangeNetwork={handleChangeNetwork}
          ethereumNetworks={chains}
          selectedEthereumNetwork={selectedEthereumNetwork}
        />
        <ScaleFade
          in={!!selectedEthereumNetwork}
          transition={{ enter: { delay: 0.15 } }}
          unmountOnExit
        >
          <VStack alignItems={'start'} spacing={'25px'}>
            <Text variant={'header'}>Select Wallet</Text>
            {connectors.map(wagmiConnector => (
              <SelectWalletMenu
                key={wagmiConnector.id}
                wagmiConnector={wagmiConnector}
                handleConnectWallet={handleConnectWallet}
              />
            ))}
          </VStack>
        </ScaleFade>
      </VStack>
    </ModalLayout>
  );
}
