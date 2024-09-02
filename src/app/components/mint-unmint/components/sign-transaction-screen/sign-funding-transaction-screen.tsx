import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useToast } from '@chakra-ui/react';
import { BitcoinWalletContext } from '@providers/bitcoin-wallet-context-provider';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';
import { VaultContext } from '@providers/vault-context-provider';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { modalActions } from '@store/slices/modal/modal.actions';

import { DepositBitcoinTransactionForm } from './components/transaction-form';

interface SignFundingTransactionScreenProps {
  handleSignFundingTransaction: (vaultUUID: string, depositAmount: number) => Promise<void>;
  isBitcoinWalletLoading: [boolean, string];
  userEthereumAddressRiskLevel: string;
  fetchUserEthereumAddressRiskLevel: () => Promise<string>;
  isUserEthereumAddressRiskLevelLoading: boolean;
}

export function SignFundingTransactionScreen({
  handleSignFundingTransaction,
  isBitcoinWalletLoading,
  userEthereumAddressRiskLevel,
  fetchUserEthereumAddressRiskLevel,
  isUserEthereumAddressRiskLevelLoading,
}: SignFundingTransactionScreenProps): React.JSX.Element {
  const toast = useToast();
  const dispatch = useDispatch();

  const { bitcoinWalletContextState, resetBitcoinWalletContext } = useContext(BitcoinWalletContext);

  const { bitcoinPrice } = useContext(ProofOfReserveContext);
  const { allVaults } = useContext(VaultContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mintStep } = useSelector((state: RootState) => state.mintunmint);

  const currentVault = allVaults.find(vault => vault.uuid === mintStep[1]);

  async function handleDeposit(depositAmount: number) {
    if (!currentVault) return;

    try {
      setIsSubmitting(true);
      const currentRisk = await fetchUserEthereumAddressRiskLevel();
      if (currentRisk === 'High') throw new Error('Risk Level is too high');
      await handleSignFundingTransaction(currentVault.uuid, depositAmount);
    } catch (error: any) {
      setIsSubmitting(false);
      toast({
        title: 'Failed to sign Deposit Transaction',
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
    <DepositBitcoinTransactionForm
      vault={currentVault}
      bitcoinWalletContextState={bitcoinWalletContextState}
      isBitcoinWalletLoading={isBitcoinWalletLoading}
      bitcoinPrice={bitcoinPrice}
      isSubmitting={isSubmitting}
      userEthereumAddressRiskLevel={userEthereumAddressRiskLevel}
      isUserEthereumAddressRiskLevelLoading={isUserEthereumAddressRiskLevelLoading}
      handleConnect={handleConnect}
      handleDeposit={handleDeposit}
      handleCancel={handleCancel}
    />
  );
}
