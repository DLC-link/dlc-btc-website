import { useContext, useState } from 'react';
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

interface DepositTransactionScreenProps {
  handleSignFundingTransaction: (vaultUUID: string, depositAmount: number) => Promise<void>;
  isBitcoinWalletLoading: [boolean, string];
  userEthereumAddressRiskLevel: string;
  fetchUserEthereumAddressRiskLevel: () => Promise<string>;
  isUserEthereumAddressRiskLevelLoading: boolean;
}

export function DepositTransactionScreen({
  handleSignFundingTransaction,
  isBitcoinWalletLoading,
  userEthereumAddressRiskLevel,
  fetchUserEthereumAddressRiskLevel,
  isUserEthereumAddressRiskLevelLoading,
}: DepositTransactionScreenProps): React.JSX.Element {
  const toast = useToast();
  const dispatch = useDispatch();

  const { bitcoinWalletContextState, resetBitcoinWalletContext } = useContext(BitcoinWalletContext);

  const { bitcoinPrice, depositLimit } = useContext(ProofOfReserveContext);
  const { allVaults } = useContext(VaultContext);

  const { mintStep } = useSelector((state: RootState) => state.mintunmint);

  console.log('allVaultsDEPOSIT', allVaults);

  const currentVault = mintStep[2];

  console.log('currentVaultDEPOSIT', currentVault);

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleButtonClick(assetAmount: number) {
    bitcoinWalletContextState === BitcoinWalletContextState.READY
      ? await handleDeposit(assetAmount)
      : handleConnect();
  }

  return (
    <VStack w={'45%'} spacing={'15px'}>
      <Vault vault={currentVault!} variant={'selected'} />
      <VaultTransactionForm
        vault={currentVault!}
        flow={'mint'}
        currentStep={mintStep[0]}
        currentBitcoinPrice={bitcoinPrice}
        bitcoinWalletContextState={bitcoinWalletContextState}
        isBitcoinWalletLoading={isBitcoinWalletLoading}
        userEthereumAddressRiskLevel={userEthereumAddressRiskLevel}
        isUserEthereumAddressRiskLevelLoading={isUserEthereumAddressRiskLevelLoading}
        handleButtonClick={handleButtonClick}
        handleCancelButtonClick={handleCancel}
        depositLimit={depositLimit}
        isSubmitting={isSubmitting}
      />
    </VStack>
  );
}
