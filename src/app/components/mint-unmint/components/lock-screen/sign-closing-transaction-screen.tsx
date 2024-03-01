import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, VStack, useToast } from '@chakra-ui/react';
import { VaultCard } from '@components/vault/vault-card';
import { UseBitcoinReturnType } from '@hooks/use-bitcoin';
import { UseEthereumReturnType } from '@hooks/use-ethereum';
import { UseSignPSBTReturnType } from '@hooks/use-psbt';
import { useVaults } from '@hooks/use-vaults';
import { BitcoinError } from '@models/error-types';
import { Vault } from '@models/vault';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';

import { LockScreenProtocolFee } from './components/protocol-fee';

interface SignClosingTransactionScreenProps {
  bitcoinHandler: UseBitcoinReturnType;
  ethereumHandler: UseEthereumReturnType;
  psbtHandler: UseSignPSBTReturnType;
  currentStep: [number, string];
}

export function SignClosingTransactionScreen({
  currentStep,
  bitcoinHandler,
  ethereumHandler,
  psbtHandler,
}: SignClosingTransactionScreenProps): React.JSX.Element {
  const toast = useToast();
  const dispatch = useDispatch();

  const { readyVaults } = useVaults();

  const { bitcoinPrice } = bitcoinHandler;
  const { getProtocolFee } = ethereumHandler;
  const { handleSignClosingTransaction } = psbtHandler;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [protocolFeePercentage, setProtocolFeePercentage] = useState<number | undefined>(undefined);

  const currentVault = readyVaults.find(vault => vault.uuid === currentStep[1]);

  useEffect(() => {
    const fetchProtocolFeePercentage = async () => {
      const currentProtocolFeePercentage = await getProtocolFee();
      setProtocolFeePercentage(currentProtocolFeePercentage);
    };
    fetchProtocolFeePercentage();
  }, [getProtocolFee]);

  async function handleClick(currentVault?: Vault) {
    if (!currentVault) return;

    try {
      setIsSubmitting(true);
      await handleSignClosingTransaction();
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
        bitcoinPrice={bitcoinPrice}
        protocolFeePercentage={protocolFeePercentage}
      />
      <Button
        isLoading={isSubmitting}
        variant={'account'}
        onClick={() => handleClick(currentVault)}
      >
        Sign Closing TX
      </Button>
      <Button
        isLoading={isSubmitting}
        variant={'navigate'}
        onClick={() => dispatch(mintUnmintActions.setMintStep([0, '']))}
      >
        Cancel
      </Button>
    </VStack>
  );
}
