import { useContext, useState } from 'react';

import { Button, VStack, useToast } from '@chakra-ui/react';
import { submitSetupXRPLVaultRequest } from '@functions/attestor-request.functions';
import { useEthersSigner } from '@functions/configuration.functions';
import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { NetworkConfigurationContext } from '@providers/network-configuration.provider';
import { RippleNetworkConfigurationContext } from '@providers/ripple-network-configuration.provider';
import { setupVault } from 'dlc-btc-lib/ethereum-functions';
import { getRippleWallet } from 'dlc-btc-lib/ripple-functions';

import { SetupVaultScreenVaultGraphics } from './components/setup-vault-screen.vault-graphics';

export function SetupVaultScreen(): React.JSX.Element {
  const toast = useToast();
  const { networkType } = useContext(NetworkConfigurationContext);
  const { rippleUserAddress } = useContext(RippleNetworkConfigurationContext);

  const { ethereumNetworkConfiguration } = useContext(EthereumNetworkConfigurationContext);

  const signer = useEthersSigner();

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSetup() {
    try {
      setIsSubmitting(true);
      if (networkType === 'xrpl') {
        await submitSetupXRPLVaultRequest(rippleUserAddress!);
      } else if (networkType === 'evm') {
        await setupVault(ethereumNetworkConfiguration.dlcManagerContract.connect(signer!));
      } else {
        throw new Error('Unsupported Network Type');
      }
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
