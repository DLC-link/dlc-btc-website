import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  Button,
  HStack,
  Image,
  ScaleFade,
  Spinner,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { VaultCard } from '@components/vault/vault-card';
import { useBitcoinPrice } from '@hooks/use-bitcoin-price';
import { useLeather } from '@hooks/use-leather';
import { useVaults } from '@hooks/use-vaults';
import { BitcoinError } from '@models/error-types';
import { Vault } from '@models/vault';
import { BitcoinWalletType, bitcoinWallets } from '@models/wallet';
import {
  BitcoinWalletContext,
  BitcoinWalletContextState,
} from '@providers/ledger-context-provider';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { modalActions } from '@store/slices/modal/modal.actions';
import { boxShadowAnimation } from '@styles/css-styles';

import { LockScreenProtocolFee } from './components/protocol-fee';

interface SignFundingTransactionScreenProps {
  currentStep: [number, string];
  handleSignFundingTransaction: (vault: Vault) => Promise<void>;
  isLoading: [boolean, string];
}

export function SignFundingTransactionScreen({
  currentStep,
  handleSignFundingTransaction,
  isLoading,
}: SignFundingTransactionScreenProps): React.JSX.Element {
  const toast = useToast();
  const dispatch = useDispatch();

  const { bitcoinWalletContextState, bitcoinWalletType } = useContext(BitcoinWalletContext);

  const { bitcoinPrice } = useBitcoinPrice();
  const { readyVaults } = useVaults();
  const { getLeatherWalletInformation } = useLeather();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentVault = readyVaults.find(vault => vault.uuid === currentStep[1]);
  const [buttonText, setButtonText] = useState('Select Bitcoin Wallet');

  useEffect(() => {
    switch (bitcoinWalletContextState) {
      case BitcoinWalletContextState.SELECT_BITCOIN_WALLET_READY:
        setButtonText('Connect Bitcoin Wallet');
        break;
      case BitcoinWalletContextState.TAPROOT_MULTISIG_ADDRESS_READY:
        setButtonText('Sign Funding Transaction');
        break;
      default:
        setButtonText('Select Bitcoin Wallet');
        break;
    }
  }, [bitcoinWalletContextState]);

  async function handleSign(currentVault?: Vault) {
    if (!currentVault) return;

    try {
      setIsSubmitting(true);
      await handleSignFundingTransaction(currentVault);
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

  async function handleClick() {
    switch (bitcoinWalletContextState) {
      case BitcoinWalletContextState.SELECT_BITCOIN_WALLET_READY:
        if (bitcoinWalletType === BitcoinWalletType.Ledger) {
          dispatch(modalActions.toggleLedgerModalVisibility());
        } else {
          await getLeatherWalletInformation(currentStep[1]);
        }
        break;
      default:
        dispatch(modalActions.toggleSelectBitcoinWalletModalVisibility());
        break;
    }
  }

  return (
    <VStack w={'45%'} spacing={'15px'}>
      <VaultCard vault={currentVault} isSelected />
      <LockScreenProtocolFee
        assetAmount={currentVault?.collateral}
        bitcoinPrice={bitcoinPrice}
        protocolFeePercentage={currentVault?.btcMintFeeBasisPoints}
      />
      {isLoading[0] && (
        <HStack
          p={'5%'}
          w={'100%'}
          spacing={4}
          bgColor={'background.content.01'}
          justifyContent={'space-between'}
        >
          <Text fontSize={'sm'} color={'white.01'}>
            {isLoading[1]}
          </Text>
          <Spinner size="xs" color="accent.lightBlue.01" />
        </HStack>
      )}

      <Button
        isLoading={isSubmitting}
        variant={'account'}
        onClick={() =>
          bitcoinWalletContextState === BitcoinWalletContextState.TAPROOT_MULTISIG_ADDRESS_READY
            ? handleSign(currentVault)
            : handleClick()
        }
      >
        {buttonText}
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
