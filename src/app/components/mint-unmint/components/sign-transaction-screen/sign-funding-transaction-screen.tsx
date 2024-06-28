import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useToast } from '@chakra-ui/react';
import { useVaults } from '@hooks/use-vaults';
import {
  BitcoinWalletContext,
  BitcoinWalletContextState,
} from '@providers/bitcoin-wallet-context-provider';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { modalActions } from '@store/slices/modal/modal.actions';

import { TransactionForm } from './components/transaction-form';

const ActionButtonTextMap = {
  [BitcoinWalletContextState.INITIAL]: 'Connect Bitcoin Wallet',
  [BitcoinWalletContextState.SELECTED]: 'Connect Bitcoin Wallet',
  [BitcoinWalletContextState.READY]: 'Sign Funding Transaction',
};

interface SignFundingTransactionScreenProps {
  handleSignFundingTransaction: (vaultUUID: string, depositAmount: number) => Promise<void>;
  isBitcoinWalletLoading: [boolean, string];
  risk: string;
  fetchRisk: () => Promise<string>;
  isRiskLoading: boolean;
}

export function SignFundingTransactionScreen({
  handleSignFundingTransaction,
  isBitcoinWalletLoading,
  risk,
  fetchRisk,
  isRiskLoading,
}: SignFundingTransactionScreenProps): React.JSX.Element {
  const toast = useToast();
  const dispatch = useDispatch();

  const { bitcoinWalletContextState, resetBitcoinWalletContext } = useContext(BitcoinWalletContext);

  const { bitcoinPrice } = useContext(ProofOfReserveContext);
  const { allVaults } = useVaults();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mintStep } = useSelector((state: RootState) => state.mintunmint);

  const currentVault = allVaults.find(vault => vault.uuid === mintStep[1]);

  async function handleSign(depositAmount: number) {
    if (!currentVault) return;

    try {
      setIsSubmitting(true);
      // const currentRisk = await fetchRisk();
      // if (currentRisk === 'High') throw new Error('Risk Level is too high');
      await handleSignFundingTransaction(currentVault.uuid, depositAmount);
    } catch (error: any) {
      setIsSubmitting(false);
      toast({
        title: 'Failed to sign transaction',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }

  function handleConnect() {
    dispatch(modalActions.toggleSelectBitcoinWalletModalVisibility());
  }

  function handleCancel() {
    resetBitcoinWalletContext();
    dispatch(mintUnmintActions.setMintStep([0, '']));
  }

  return (
    <TransactionForm
      type={'deposit'}
      bitcoinWalletContextState={bitcoinWalletContextState}
      vault={currentVault}
      bitcoinPrice={bitcoinPrice}
      isBitcoinWalletLoading={isBitcoinWalletLoading}
      isSubmitting={isSubmitting}
      risk={risk}
      isRiskLoading={isRiskLoading}
      actionButtonText={ActionButtonTextMap[bitcoinWalletContextState]}
      handleConnect={handleConnect}
      handleSign={handleSign}
      handleCancel={handleCancel}
    />
  );
}
