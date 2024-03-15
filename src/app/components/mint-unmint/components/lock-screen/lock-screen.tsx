import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, VStack, useToast } from '@chakra-ui/react';
import { VaultCard } from '@components/vault/vault-card';
import { useBitcoin } from '@hooks/use-bitcoin';
import { useEthereum } from '@hooks/use-ethereum';
import { usePSBT } from '@hooks/use-psbt';
import { useVaults } from '@hooks/use-vaults';
import { BitcoinError } from '@models/error-types';
import { Vault } from '@models/vault';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';

import { LockScreenProtocolFee } from './components/protocol-fee';

interface LockScreenProps {
  currentStep: [number, string];
}

export function LockScreen({ currentStep }: LockScreenProps): React.JSX.Element {
  const toast = useToast();
  const dispatch = useDispatch();

  const { bitcoinPrice } = useBitcoin();
  const { getProtocolFee } = useEthereum();
  const { readyVaults } = useVaults();
  const { handleSignFundingTransaction } = usePSBT();

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
      await handleSignFundingTransaction(currentVault.collateral, currentVault.uuid);
      setTimeout(() => {
        dispatch(mintUnmintActions.setMintStep([2, currentVault.uuid]));
        setIsSubmitting(false);
      }, 3000);
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
        Lock BTC
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
