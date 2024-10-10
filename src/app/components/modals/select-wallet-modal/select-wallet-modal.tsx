import { useContext, useEffect, useState } from 'react';

import { Button, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { ModalComponentProps } from '@components/modals/components/modal-container';
import { ModalLayout } from '@components/modals/components/modal.layout';
import { RippleWalletContext } from '@providers/ripple-user-wallet-context-provider';
import { useForm } from '@tanstack/react-form';

function validateXRPLSeed(userSeed: string): string | undefined {
  if (userSeed.length !== 31) {
    return 'Please enter a valid XRPL address';
  }
}

export function SelectWalletModal({ isOpen, handleClose }: ModalComponentProps): React.JSX.Element {
  // const { connect, isPending, isSuccess, connectors } = useConnect();

  // const { chains } = useConfig();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setRippleWallet, isRippleWalletInitialized } = useContext(RippleWalletContext);

  // const [selectedEthereumNetwork, setSelectedEthereumNetwork] = useState<Chain | undefined>(
  //   undefined
  // );
  // const [selectedWagmiConnectorID, setSelectedWagmiConnectorID] = useState<string | undefined>(
  //   undefined
  // );

  useEffect(() => {
    if (isRippleWalletInitialized) {
      console.log('isRippleWalletInitialized', isRippleWalletInitialized);
      void handleCloseAfterSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRippleWalletInitialized]);

  async function handleCloseAfterSuccess() {
    handleClose();
  }

  // async function handleConnectWallet(wagmiConnector: Connector) {
  //   setSelectedWagmiConnectorID(wagmiConnector.id);
  //   connect({ chainId: selectedEthereumNetwork?.id, connector: wagmiConnector });
  //   if (wagmiConnector.id === 'walletConnect') {
  //     handleClose();
  //   }
  // }

  // const handleChangeNetwork = (ethereumNetwork: Chain) => {
  //   setSelectedEthereumNetwork(ethereumNetwork);
  // };

  async function handleButtonClick(userSeed: string) {
    setIsSubmitting(true);
    console.log('setting it to true');
    await setRippleWallet(userSeed);
    setIsSubmitting(false);
  }

  useEffect(() => {
    console.log('isSubmitting', isSubmitting);
  }, [isSubmitting]);

  const form = useForm({
    defaultValues: {
      userSeed: '',
    },
    onSubmit: async ({ value }) => {
      await handleButtonClick(value.userSeed);
    },
    validators: {
      onChange: ({ value }) => {
        return {
          fields: {
            userSeed: validateXRPLSeed(value.userSeed),
          },
        };
      },
    },
  });

  return (
    <ModalLayout title="Connect Wallet" isOpen={isOpen} onClose={() => handleClose()}>
      <VStack alignItems={'start'} spacing={'25px'}>
        <Text variant={'header'}>Enter XRPL Seed</Text>
        <form
          onSubmit={async e => {
            e.preventDefault();
            e.stopPropagation();
            await form.handleSubmit();
          }}
        >
          <form.Field name={'userSeed'}>
            {field => (
              <HStack w={'100%'}>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                />
                <form.Subscribe
                  selector={state => [state.canSubmit]}
                  children={([canSubmit]) => (
                    <Button
                      w={'25%'}
                      variant={'navigate'}
                      fontSize={'xs'}
                      onClick={form.handleSubmit}
                      isDisabled={!canSubmit}
                    >
                      {isSubmitting ? 'Loading' : 'Connect'}
                    </Button>
                  )}
                />
              </HStack>
            )}
          </form.Field>
        </form>
        {/* {!selectedEthereumNetwork ? (
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
            ))} */}
        {/* </VStack> */}
        {/* </ScaleFade> */}
      </VStack>
    </ModalLayout>
  );
}
