import { useContext, useState } from 'react';

import { Button, VStack, useToast } from '@chakra-ui/react';
import { EthereumError } from '@models/error-types';
import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { setupVault } from 'dlc-btc-lib/ethereum-functions';

export function SetupVaultScreen(): React.JSX.Element {
  const toast = useToast();

  const { getDLCManagerContract } = useContext(EthereumNetworkConfigurationContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSetup() {
    try {
      setIsSubmitting(true);
      await setupVault(await getDLCManagerContract());
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: 'Failed to create Vault',
        description: error instanceof EthereumError ? error.message : '',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }

  return (
    <VStack w={'45%'} h={'445px'} justifyContent={'center'}>
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
