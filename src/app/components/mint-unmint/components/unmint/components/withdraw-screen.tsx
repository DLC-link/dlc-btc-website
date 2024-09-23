import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { VStack, useToast } from '@chakra-ui/react';
import { VaultTransactionForm } from '@components/transaction-screen/transaction-screen.transaction-form/components/transaction-screen.transaction-form/transaction-screen.transaction-form';
import { Vault } from '@components/vault/vault';
import {
  BitcoinWalletContext,
  BitcoinWalletContextState,
} from '@providers/bitcoin-wallet-context-provider';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';
import { VaultContext } from '@providers/vault-context-provider';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { modalActions } from '@store/slices/modal/modal.actions';

interface WithdrawScreenProps {
  handleSignWithdrawTransaction: (vaultUUID: string, withdrawAmount: number) => Promise<void>;
  isBitcoinWalletLoading: [boolean, string];
}

export function WithdrawScreen({
  handleSignWithdrawTransaction,
  isBitcoinWalletLoading,
}: WithdrawScreenProps): React.JSX.Element {
  const dispatch = useDispatch();
  const toast = useToast();

  const { bitcoinWalletContextState, resetBitcoinWalletContext } = useContext(BitcoinWalletContext);

  const { bitcoinPrice, depositLimit } = useContext(ProofOfReserveContext);
  const { allVaults } = useContext(VaultContext);

  const { unmintStep } = useSelector((state: RootState) => state.mintunmint);
  const currentVault = allVaults.find(vault => vault.uuid === unmintStep[1]);

  async function handleWithdraw(withdrawAmount: number): Promise<void> {
    if (currentVault) {
      try {
        await handleSignWithdrawTransaction(currentVault.uuid, withdrawAmount);
      } catch (error) {
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

  function handleCancel() {
    resetBitcoinWalletContext();
    dispatch(mintUnmintActions.setUnmintStep([0, '']));
  }

  async function handleButtonClick(assetAmount: number) {
    bitcoinWalletContextState === BitcoinWalletContextState.READY
      ? await handleWithdraw(assetAmount)
      : handleConnect();
  }

  return (
    <VStack w={'45%'} spacing={'15px'}>
      <Vault vault={currentVault!} />
      <VaultTransactionForm
        vault={currentVault!}
        type={'withdraw'}
        currentBitcoinPrice={bitcoinPrice}
        bitcoinWalletContextState={bitcoinWalletContextState}
        isBitcoinWalletLoading={isBitcoinWalletLoading}
        handleButtonClick={handleButtonClick}
        handleCancelButtonClick={handleCancel}
        depositLimit={depositLimit}
      />
    </VStack>
  );
}
