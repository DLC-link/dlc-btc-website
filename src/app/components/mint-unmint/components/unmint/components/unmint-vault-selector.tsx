import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Text, VStack, useToast } from '@chakra-ui/react';
import { VaultsListGroupContainer } from '@components/vaults-list/components/vaults-list-group-container';
import { VaultsList } from '@components/vaults-list/vaults-list';
import { useVaults } from '@hooks/use-vaults';
import { Vault } from '@models/vault';
import {
  BitcoinWalletContext,
  BitcoinWalletContextState,
} from '@providers/bitcoin-wallet-context-provider';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';
import { RootState } from '@store/index';
import { modalActions } from '@store/slices/modal/modal.actions';

import { TransactionForm } from '../../sign-transaction-screen/components/transaction-form';

const ActionButtonTextMap = {
  [BitcoinWalletContextState.INITIAL]: 'Connect Bitcoin Wallet',
  [BitcoinWalletContextState.SELECTED]: 'Connect Bitcoin Wallet',
  [BitcoinWalletContextState.READY]: 'Sign Withdrawal Transaction',
};

interface UnmintVaultSelectorProps {
  handleSignWithdrawTransaction: (vaultUUID: string, withdrawAmount: number) => Promise<void>;
  isBitcoinWalletLoading: [boolean, string];
  risk: string;
  fetchRisk: () => Promise<string>;
  isRiskLoading: boolean;
}

export function UnmintVaultSelector({
  handleSignWithdrawTransaction,
  isBitcoinWalletLoading,
  risk,
  fetchRisk,
  isRiskLoading,
}: UnmintVaultSelectorProps): React.JSX.Element {
  const toast = useToast();
  const dispatch = useDispatch();

  const { bitcoinWalletContextState } = useContext(BitcoinWalletContext);

  const { bitcoinPrice } = useContext(ProofOfReserveContext);
  const { fundedVaults } = useVaults();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { unmintStep } = useSelector((state: RootState) => state.mintunmint);

  const [selectedVault, setSelectedVault] = useState<Vault | undefined>();

  function handleSelect(uuid: string): void {
    const vault = fundedVaults.find(vault => vault.uuid === uuid);
    if (vault) setSelectedVault(vault);
  }

  useEffect(() => {
    setSelectedVault(fundedVaults.find(vault => vault.uuid === unmintStep[1]));
  }, [fundedVaults, unmintStep]);

  async function handleWithdraw(withdrawAmount: number): Promise<void> {
    if (selectedVault) {
      try {
        setIsSubmitting(true);
        // const currentRisk = await fetchRisk();
        // if (currentRisk === 'High') throw new Error('Risk Level is too high');
        await handleSignWithdrawTransaction(selectedVault.uuid, withdrawAmount);
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

  function handleCancel() {
    setSelectedVault(undefined);
  }

  return (
    <>
      {selectedVault ? (
        <TransactionForm
          type={'withdraw'}
          bitcoinWalletContextState={bitcoinWalletContextState}
          vault={selectedVault}
          bitcoinPrice={bitcoinPrice}
          isBitcoinWalletLoading={isBitcoinWalletLoading}
          isSubmitting={isSubmitting}
          risk={risk}
          isRiskLoading={isRiskLoading}
          actionButtonText={ActionButtonTextMap[bitcoinWalletContextState]}
          handleConnect={handleConnect}
          handleSign={handleWithdraw}
          handleCancel={handleCancel}
        />
      ) : fundedVaults.length == 0 ? (
        <VStack w={'45%'}>
          <Text color={'white'}>You don't have any active vaults.</Text>
        </VStack>
      ) : (
        <VStack w={'45%'}>
          <Text color={'accent.lightBlue.01'} fontSize={'md'} fontWeight={600}>
            Select vault to redeem dlcBTC:
          </Text>
          <VaultsList height={'425.5px'} isScrollable={!selectedVault}>
            <VaultsListGroupContainer
              vaults={fundedVaults}
              isSelectable
              handleSelect={handleSelect}
            />
          </VaultsList>
        </VStack>
      )}
    </>
  );
}
