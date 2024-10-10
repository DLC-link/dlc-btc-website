import { useContext, useState } from 'react';

import { Button, VStack, useToast } from '@chakra-ui/react';
import { setupXRPLVault } from '@functions/fetch.functions';
import { RippleWalletContext } from '@providers/ripple-user-wallet-context-provider';

import { SetupVaultScreenVaultGraphics } from './components/setup-vault-screen.vault-graphics';

export function SetupVaultScreen(): React.JSX.Element {
  const toast = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { rippleWallet } = useContext(RippleWalletContext);

  async function handleSetup() {
    try {
      setIsSubmitting(true);
      await setupXRPLVault(rippleWallet?.classicAddress!);
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
