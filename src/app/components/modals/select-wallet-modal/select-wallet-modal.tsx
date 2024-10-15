import { useContext, useEffect, useState } from 'react';

import { CheckIcon } from '@chakra-ui/icons';
import { HStack, ScaleFade, Tab, TabList, Tabs, Text, VStack } from '@chakra-ui/react';
import { ModalComponentProps } from '@components/modals/components/modal-container';
import { ModalLayout } from '@components/modals/components/modal.layout';
import { SelectNetworkButton } from '@components/select-network-button/select-network-button';
import { TransactionScreenWalletInformation } from '@components/transaction-screen/transaction-screen.transaction-form/components/transaction-screen.transaction-form/components/transaction-screen.transaction-form.wallet-information';
import { useXRPLLedger } from '@hooks/use-xrpl-ledger';
import { RippleNetworkID } from '@models/ripple.models';
import { xrpWallets } from '@models/wallet';
import { NetworkConfigurationContext } from '@providers/network-configuration.provider';
import { RippleNetworkConfigurationContext } from '@providers/ripple-network-configuration.provider';
import { XRPWalletContext, XRPWalletContextState } from '@providers/xrp-wallet-context-provider';
import { EthereumNetworkID } from 'dlc-btc-lib/models';
import { delay } from 'dlc-btc-lib/utilities';
import { Connector, useConfig, useConnect } from 'wagmi';

import { SelectEthereumWalletMenu } from './components/select-ethereum-wallet-menu';
import { SelectRippleWalletMenu } from './components/select-ripple-wallet-menu';

export function SelectWalletModal({ isOpen, handleClose }: ModalComponentProps): React.JSX.Element {
  const { connect, isPending, isSuccess, connectors } = useConnect();
  const { chains: ethereumNetworks } = useConfig();

  const { setNetworkType } = useContext(NetworkConfigurationContext);
  const {
    setXRPWalletType,
    setXRPWalletContextState,
    setUserAddress,
    xrpWalletContextState,
    setXRPHandler,
  } = useContext(XRPWalletContext);
  const { connectLedgerWallet, isLoading } = useXRPLLedger();
  const { enabledRippleNetworks } = useContext(RippleNetworkConfigurationContext);

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
    if (isSuccess || xrpWalletContextState === XRPWalletContextState.READY) {
      void handleCloseAfterSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, xrpWalletContextState]);

  async function handleCloseAfterSuccess() {
    await delay(1000);
    setSelectedNetworkID(undefined);
    setSelectedWagmiConnectorID(undefined);
    if (selectedWagmiConnectorID !== 'walletConnect') handleClose();
    setSelectedNetworkType('evm');
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

  async function handleConnectRippleWallet() {
    setNetworkType('xrpl');
    setXRPWalletType(xrpWallets[0].id);

    const { xrpHandler, userAddress } = await connectLedgerWallet("44'/144'/0'/0/1");

    setXRPHandler(xrpHandler);
    setUserAddress(userAddress);
    setXRPWalletContextState(XRPWalletContextState.READY);
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
              : xrpWallets.map(rippleWallet => (
                  <SelectRippleWalletMenu
                    key={rippleWallet.id}
                    rippleWallet={rippleWallet}
                    handleConnectWallet={handleConnectRippleWallet}
                  />
                ))}
            <TransactionScreenWalletInformation isBitcoinWalletLoading={isLoading} />
          </VStack>
        </ScaleFade>
      </VStack>
    </ModalLayout>
  );
}
