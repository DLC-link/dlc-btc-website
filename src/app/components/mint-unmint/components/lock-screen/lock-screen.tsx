import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, Checkbox, Fade, HStack, Stack, Text, VStack, useToast } from '@chakra-ui/react';
import { VaultCard } from '@components/vault/vault-card';
import { useSignPSBT } from '@hooks/use-sign-psbt';
import { useVaults } from '@hooks/use-vaults';
import { BitcoinError } from '@models/error-types';
import { Vault } from '@models/vault';
import { BlockchainContext } from '@providers/blockchain-context-provider';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';

import { LockScreenProtocolFee } from './components/protocol-fee';

interface LockScreenProps {
  currentStep: [number, string];
}

export function LockScreen({ currentStep }: LockScreenProps): React.JSX.Element {
  const toast = useToast();
  const dispatch = useDispatch();
  const { readyVaults } = useVaults();
  const blockchainContext = useContext(BlockchainContext);
  const bitcoin = blockchainContext?.bitcoin;
  const { handleSignTransaction, fundingTransactionSigned, closingTransactionSigned } =
    useSignPSBT(bitcoin);
  const ethereum = blockchainContext?.ethereum;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [protocolFeePercentage, setProtocolFeePercentage] = useState<number | undefined>(undefined);

  const currentVault = readyVaults.find(vault => vault.uuid === currentStep[1]);

  useEffect(() => {
    const fetchProtocolFeePercentage = async () => {
      const currentProtocolFeePercentage = await ethereum?.getProtocolFee();
      setProtocolFeePercentage(currentProtocolFeePercentage);
    };
    fetchProtocolFeePercentage();
  }, [ethereum]);

  async function handleClick(currentVault?: Vault) {
    if (!currentVault) return;

    try {
      setIsSubmitting(true);
      await handleSignTransaction(currentVault.collateral, currentVault.uuid);
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: 'Failed to sign transaction',
        description: error instanceof BitcoinError ? error.message : '',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }

  return (
    <VStack w={'300px'} spacing={'15px'}>
      <VaultCard vault={currentVault} isSelected />
      <LockScreenProtocolFee
        assetAmount={currentVault?.collateral}
        bitcoinPrice={bitcoin?.bitcoinPrice}
        protocolFeePercentage={protocolFeePercentage}
      />
      <Button
        isLoading={isSubmitting}
        variant={'account'}
        onClick={() => handleClick(currentVault)}
      >
        Lock BTC
      </Button>
      <Button
        isLoading={isSubmitting}
        variant={'navigate'}
        onClick={() => dispatch(mintUnmintActions.setMintStep([0, '']))}
      >
        Cancel
      </Button>
      <Stack w={'100%'}>
        <Fade in={isSubmitting || (fundingTransactionSigned && !closingTransactionSigned)}>
          <VStack w={'100%'} spacing={'10px'} p={'15px'} bgColor={'white.03'} borderRadius={'md'}>
            <HStack w={'100%'} justifyContent={'space-between'}>
              <Checkbox
                iconColor={'accent.orange.01'}
                isChecked={fundingTransactionSigned}
                isDisabled
              />
              <Text color={'white.01'} fontSize={'sm'} fontWeight={800}>
                Funding Transaction
              </Text>
            </HStack>
            <HStack w={'100%'} justifyContent={'space-between'}>
              <Checkbox
                iconColor={'accent.orange.01'}
                isChecked={closingTransactionSigned}
                isDisabled
              />
              <Text color={'white.01'} fontSize={'sm'} fontWeight={800}>
                Closing Transaction
              </Text>
            </HStack>
          </VStack>
        </Fade>
      </Stack>
    </VStack>
  );
}
