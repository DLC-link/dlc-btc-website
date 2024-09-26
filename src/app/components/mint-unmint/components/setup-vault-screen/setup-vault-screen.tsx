import { useContext, useState } from 'react';

import { Button, VStack, useToast } from '@chakra-ui/react';
import { useEthersSigner } from '@functions/configuration.functions';
import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { setupVault } from 'dlc-btc-lib/ethereum-functions';

import { SetupVaultScreenVaultGraphics } from './components/setup-vault-screen.vault-graphics';

export function SetupVaultScreen(): React.JSX.Element {
  const toast = useToast();

  const { ethereumNetworkConfiguration } = useContext(EthereumNetworkConfigurationContext);

  const signer = useEthersSigner();

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSetup() {
    try {
      setIsSubmitting(true);
      await setupVault(ethereumNetworkConfiguration.dlcManagerContract.connect(signer!));
    } catch (error: any) {
      setIsSubmitting(false);
      toast({
        title: 'Failed to create Vault',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }

  return (
    <VStack w={'45%'}>
      <SetupVaultScreenVaultGraphics />
      <Button
        isLoading={isSubmitting}
        variant={'account'}
        type={'submit'}
        onClick={() => handleSetup()}
      >
        Create Vault
      </Button>
    </VStack>
  );
}
