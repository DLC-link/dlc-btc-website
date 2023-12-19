import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, VStack } from '@chakra-ui/react';
import { VaultCard } from '@components/vault/vault-card';
import { useVaults } from '@hooks/use-vaults';
import { Vault } from '@models/vault';
import { BlockchainContext } from '@providers/blockchain-context-provider';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';

import { LockScreenProtocolFee } from './components/protocol-fee';

interface LockScreenProps {
  currentStep: [number, string];
}

export function LockScreen({ currentStep }: LockScreenProps): React.JSX.Element {
  const dispatch = useDispatch();
  const { readyVaults } = useVaults();
  const blockchainContext = useContext(BlockchainContext);
  const bitcoin = blockchainContext?.bitcoin;
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
      await bitcoin?.fetchBitcoinContractOfferAndSendToUserWallet(currentVault);
    } catch (error) {
      setIsSubmitting(false);
      throw new Error('Error locking vault');
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
    </VStack>
  );
}
