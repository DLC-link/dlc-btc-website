import { useContext, useEffect, useState } from 'react';

import { CheckIcon } from '@chakra-ui/icons';
import { HStack, ScaleFade, Tab, TabList, Tabs, Text, VStack } from '@chakra-ui/react';
import { ModalComponentProps } from '@components/modals/components/modal-container';
import { ModalLayout } from '@components/modals/components/modal.layout';
import { SelectWalletMenu } from '@components/modals/select-wallet-modal/components/select-wallet-menu';
import { SelectNetworkButton } from '@components/select-network-button/select-network-button';
import { RippleNetworkID } from '@models/ripple.models';
import { NetworkConfigurationContext } from '@providers/network-configuration.provider';
import { RippleNetworkConfigurationContext } from '@providers/ripple-network-configuration.provider';
import { EthereumNetworkID } from 'dlc-btc-lib/models';
import { delay } from 'dlc-btc-lib/utilities';
import { Connector, useConfig, useConnect } from 'wagmi';

import { SelectEthereumWalletMenu } from './components/select-ethereum-wallet-menu';
import { SelectRippleWalletMenu } from './components/select-ripple-wallet-menu';

export interface RippleWallet {
  id: string;
  name: string;
  icon: string;
}

const seedWallet: RippleWallet = {
  id: 'seed',
  name: 'Seed Phrase',
  icon: './images/logos/xpr-logo.svg',
};

const rippleWallets = [seedWallet];

export function SelectWalletModal({ isOpen, handleClose }: ModalComponentProps): React.JSX.Element {
  const { connect, isPending, isSuccess, connectors } = useConnect();
  const { chains: ethereumNetworks } = useConfig();

  const { setNetworkType } = useContext(NetworkConfigurationContext);
  const { enabledRippleNetworks, setIsRippleWalletConnected } = useContext(
    RippleNetworkConfigurationContext
  );

  const ethereumNetworkIDs = ethereumNetworks.map(
    ethereumNetwork => ethereumNetwork.id.toString() as EthereumNetworkID
  );
  const rippleNetworkIDs = enabledRippleNetworks.map(rippleNetwork => rippleNetwork.id);

  const [selectedNetworkType, setSelectedNetworkType] = useState<'evm' | 'xrpl'>('evm');

  const [selectedNetworkID, setSelectedNetworkID] = useState<
    EthereumNetworkID | RippleNetworkID | undefined
  >(undefined);

  const [selectedWagmiConnectorID, setSelectedWagmiConnectorID] = useState<string | undefined>(
    undefined
  );

  const networkTypes = ['evm', 'xrpl'];

  useEffect(() => {
    if (isSuccess) {
      void handleCloseAfterSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  async function handleCloseAfterSuccess() {
    await delay(1000);
    setSelectedNetworkID(undefined);
    setSelectedWagmiConnectorID(undefined);
    if (selectedWagmiConnectorID && selectedWagmiConnectorID !== 'walletConnect') handleClose();
  }

  async function handleConnectEthereumWallet(wagmiConnector: Connector) {
    if (selectedNetworkID === undefined) return;
    setSelectedWagmiConnectorID(wagmiConnector.id);
    connect({ chainId: Number(selectedNetworkID), connector: wagmiConnector });
    setNetworkType('evm');
    if (wagmiConnector.id === 'walletConnect') {
      handleClose();
    }
  }

  async function handleConnectRippleWallet(id: string) {
    console.log('handleConnectRippleWallet', id);
    setNetworkType('xrpl');
    setIsRippleWalletConnected(true);
    handleClose();
  }

  const handleChangeNetwork = (networkID: EthereumNetworkID | RippleNetworkID) => {
    setSelectedNetworkID(networkID);
  };

  return (
    <ModalLayout title="Connect Wallet" isOpen={isOpen} onClose={() => handleClose()}>
      <VStack alignItems={'start'} spacing={'25px'}>
        {!selectedNetworkID ? (
          <Text variant={'header'}>Select Network</Text>
        ) : (
          <HStack w={'100%'} justifyContent={'space-between'}>
            <Text variant={'header'}>Network Selected</Text>
            <CheckIcon color={'accent.lightBlue.01'} />
          </HStack>
        )}
        <Tabs
          w={'100%'}
          p={'0px'}
          h={'25px'}
          justifyContent={'space-between'}
          onChange={index => {
            setSelectedNetworkType(networkTypes[index] as 'evm' | 'xrpl');
            setSelectedNetworkID(undefined);
          }}
        >
          <TabList>
            <Tab>Ethereum</Tab>
            <Tab>Ripple</Tab>
          </TabList>
        </Tabs>
        <SelectNetworkButton
          handleChangeNetwork={handleChangeNetwork}
          ethereumNetworkIDs={ethereumNetworkIDs}
          rippleNetworkIDs={rippleNetworkIDs}
          selectedNetworkID={selectedNetworkID}
          selectedNetworkType={selectedNetworkType}
        />
        <ScaleFade in={!!selectedNetworkID} transition={{ enter: { delay: 0.15 } }} unmountOnExit>
          <VStack alignItems={'start'} spacing={'25px'}>
            {!isSuccess ? (
              <Text variant={'header'}>Select Wallet</Text>
            ) : (
              <HStack w={'100%'} justifyContent={'space-between'}>
                <Text variant={'header'}>Wallet Connected</Text>
                <CheckIcon color={'accent.lightBlue.01'} />
              </HStack>
            )}
            {selectedNetworkType === 'evm'
              ? connectors.map(wagmiConnector => (
                  <SelectEthereumWalletMenu
                    key={wagmiConnector.id}
                    wagmiConnector={wagmiConnector}
                    selectedWagmiConnectorID={selectedWagmiConnectorID}
                    isConnectWalletPending={isPending}
                    isConnectWalletSuccess={isSuccess}
                    handleConnectWallet={handleConnectEthereumWallet}
                  />
                ))
              : rippleWallets.map(rippleWallet => (
                  <SelectRippleWalletMenu
                    key={rippleWallet.id}
                    rippleWallet={rippleWallet}
                    handleConnectWallet={handleConnectRippleWallet}
                  />
                ))}
          </VStack>
        </ScaleFade>
      </VStack>
    </ModalLayout>
  );
}
