import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, HStack, Spinner, Text, VStack, useToast } from '@chakra-ui/react';
import { VaultMiniCard } from '@components/vault-mini/vault-mini-card';
import {
  BitcoinWalletContext,
  BitcoinWalletContextState,
} from '@providers/bitcoin-wallet-context-provider';
import { VaultContext } from '@providers/vault-context-provider';
import { modalActions } from '@store/slices/modal/modal.actions';
import Decimal from 'decimal.js';

interface WithdrawScreenProps {
  currentStep: [number, string];
  isBitcoinWalletLoading: [boolean, string];
  handleSignWithdrawTransaction: (vaultUUID: string, withdrawAmount: number) => Promise<void>;
}

export function WithdrawScreen({
  currentStep,
  isBitcoinWalletLoading,
  handleSignWithdrawTransaction,
}: WithdrawScreenProps): React.JSX.Element {
  const dispatch = useDispatch();
  const toast = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { bitcoinWalletContextState } = useContext(BitcoinWalletContext);

  useEffect(() => {
    console.log('bitcoinWalletContextState', bitcoinWalletContextState);
    console.log('isBwC', BitcoinWalletContextState.INITIAL || BitcoinWalletContextState.SELECTED);
  }, [bitcoinWalletContextState]);

  const { allVaults } = useContext(VaultContext);
  const currentVault = allVaults.find(vault => vault.uuid === currentStep[1]);

  async function handleWithdraw(): Promise<void> {
    if (currentVault) {
      try {
        console.log('vault', currentVault);
        const withdrawAmount = new Decimal(currentVault.valueLocked).minus(
          currentVault.valueMinted
        );
        console.log('withdrawAmount', withdrawAmount);
        setIsSubmitting(true);
        await handleSignWithdrawTransaction(currentVault.uuid, withdrawAmount.toNumber());
      } catch (error) {
        setIsSubmitting(false);
        toast({
          title: 'Failed to sign transaction',
          description: error instanceof Error ? error.message : '',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }

  function handleConnect() {
    dispatch(modalActions.toggleSelectBitcoinWalletModalVisibility());
  }

  return (
    <VStack w={'45%'} h={'445px'} justifyContent={'center'}>
      {currentVault && <VaultMiniCard vault={currentVault} />}
      {isBitcoinWalletLoading[0] && (
        <HStack
          p={'5%'}
          w={'100%'}
          spacing={4}
          bgColor={'background.content.01'}
          justifyContent={'space-between'}
        >
          <Text fontSize={'sm'} color={'white.01'}>
            {isBitcoinWalletLoading[1]}
          </Text>
          <Spinner size="xs" color="accent.lightBlue.01" />
        </HStack>
      )}
      <Button
        isLoading={isSubmitting}
        variant={'account'}
        type={'submit'}
        onClick={async () =>
          bitcoinWalletContextState === BitcoinWalletContextState.READY
            ? await handleWithdraw()
            : handleConnect()
        }
      >
        {[BitcoinWalletContextState.INITIAL, BitcoinWalletContextState.SELECTED].includes(
          bitcoinWalletContextState
        )
          ? 'Connect Bitcoin Wallet'
          : `Withdraw ${new Decimal(currentVault?.valueLocked!).minus(
              currentVault?.valueMinted!
            )} BTC`}
      </Button>
    </VStack>
  );
}
