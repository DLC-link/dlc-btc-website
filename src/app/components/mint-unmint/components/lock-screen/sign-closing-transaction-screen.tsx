import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, VStack, useToast } from '@chakra-ui/react';
import { VaultCard } from '@components/vault/vault-card';
import { useBitcoinPrice } from '@hooks/use-bitcoin-price';
import { useVaults } from '@hooks/use-vaults';
import { BitcoinError } from '@models/error-types';
import { Vault } from '@models/vault';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';

import { LockScreenProtocolFee } from './components/protocol-fee';

interface SignClosingTransactionScreenProps {
  currentStep: [number, string];
  handleSignClosingTransaction: () => Promise<void>;
}

export function SignClosingTransactionScreen({
  currentStep,
  handleSignClosingTransaction,
}: SignClosingTransactionScreenProps): React.JSX.Element {
  const toast = useToast();
  const dispatch = useDispatch();

  const { readyVaults } = useVaults();

  const { bitcoinPrice } = useBitcoinPrice();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentVault = readyVaults.find(vault => vault.uuid === currentStep[1]);

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
    <VStack w={'45%'} spacing={'15px'}>
      <VaultCard vault={currentVault} isSelected />
      <LockScreenProtocolFee
        assetAmount={currentVault?.collateral}
        bitcoinPrice={bitcoinPrice}
        protocolFeePercentage={currentVault?.btcRedeemFeeBasisPoints}
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
