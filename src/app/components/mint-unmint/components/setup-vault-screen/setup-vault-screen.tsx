import { useState } from 'react';

import { Button, VStack, useToast } from '@chakra-ui/react';
import { setupXRPLVault } from '@functions/fetch.functions';
import { getRippleWallet } from 'dlc-btc-lib/ripple-functions';

import { SetupVaultScreenVaultGraphics } from './components/setup-vault-screen.vault-graphics';

export function SetupVaultScreen(): React.JSX.Element {
  const toast = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSetup() {
    try {
      setIsSubmitting(true);
      const xrplWallet = getRippleWallet('sEdSKUhR1Hhwomo7CsUzAe2pv7nqUXT');
      await setupXRPLVault(xrplWallet.classicAddress);
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
