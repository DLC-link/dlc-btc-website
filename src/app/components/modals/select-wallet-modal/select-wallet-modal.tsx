import { useEffect, useState } from 'react';

import { CheckIcon } from '@chakra-ui/icons';
import { HStack, ScaleFade, Text, VStack } from '@chakra-ui/react';
import { ModalComponentProps } from '@components/modals/components/modal-container';
import { ModalLayout } from '@components/modals/components/modal.layout';
import { SelectWalletMenu } from '@components/modals/select-wallet-modal/components/select-wallet-menu';
import { SelectNetworkButton } from '@components/select-network-button/select-network-button';
import { delay } from 'dlc-btc-lib/utilities';
import { Chain } from 'viem';
import { Connector, useConfig, useConnect } from 'wagmi';

export function SelectWalletModal({ isOpen, handleClose }: ModalComponentProps): React.JSX.Element {
  const { connect, isPending, isSuccess, connectors } = useConnect();
  const { chains } = useConfig();

  const [selectedEthereumNetwork, setSelectedEthereumNetwork] = useState<Chain | undefined>(
    undefined
  );
  const [selectedWagmiConnectorID, setSelectedWagmiConnectorID] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (isSuccess) {
      void handleCloseAfterSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  async function handleCloseAfterSuccess() {
    await delay(1000);
    setSelectedEthereumNetwork(undefined);
    setSelectedWagmiConnectorID(undefined);
    if (selectedWagmiConnectorID && selectedWagmiConnectorID !== 'walletConnect') handleClose();
  }

  async function handleConnectWallet(wagmiConnector: Connector) {
    setSelectedWagmiConnectorID(wagmiConnector.id);
    connect({ chainId: selectedEthereumNetwork?.id, connector: wagmiConnector });
    if (wagmiConnector.id === 'walletConnect') {
      handleClose();
    }
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
          <HStack w={'100%'} justifyContent={'space-between'}>
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
            {!isSuccess ? (
              <Text variant={'header'}>Select Wallet</Text>
            ) : (
              <HStack w={'100%'} justifyContent={'space-between'}>
                <Text variant={'header'}>Wallet Connected</Text>
                <CheckIcon color={'accent.lightBlue.01'} />
              </HStack>
            )}
            {connectors.map(wagmiConnector => (
              <SelectWalletMenu
                key={wagmiConnector.id}
                wagmiConnector={wagmiConnector}
                selectedWagmiConnectorID={selectedWagmiConnectorID}
                isConnectWalletPending={isPending}
                isConnectWalletSuccess={isSuccess}
                handleConnectWallet={handleConnectWallet}
              />
            ))}
          </VStack>
        </ScaleFade>
      </VStack>
    </ModalLayout>
  );
}
