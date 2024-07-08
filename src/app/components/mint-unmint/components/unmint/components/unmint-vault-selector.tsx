import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Text, VStack, useToast } from '@chakra-ui/react';
import { VaultsListGroupContainer } from '@components/vaults-list/components/vaults-list-group-container';
import { VaultsList } from '@components/vaults-list/vaults-list';
import { useEthereum } from '@hooks/use-ethereum';
import { Vault } from '@models/vault';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';
import { VaultContext } from '@providers/vault-context-provider';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { VaultState } from 'dlc-btc-lib/models';
import { shiftValue } from 'dlc-btc-lib/utilities';

import { BurnTokenTransactionForm } from '../../sign-transaction-screen/components/ethereum-transaction-form';

interface UnmintVaultSelectorProps {
  userEthereumAddressRiskLevel: string;
  fetchUserEthereumAddressRiskLevel: () => Promise<string>;
  isUserEthereumAddressRiskLevelLoading: boolean;
}

export function UnmintVaultSelector({
  userEthereumAddressRiskLevel,
  fetchUserEthereumAddressRiskLevel,
  isUserEthereumAddressRiskLevelLoading,
}: UnmintVaultSelectorProps): React.JSX.Element {
  const toast = useToast();
  const dispatch = useDispatch();
  const { withdrawVault, getVault } = useEthereum();

  const { bitcoinPrice } = useContext(ProofOfReserveContext);
  const { fundedVaults } = useContext(VaultContext);

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

  async function handleBurn(withdrawAmount: number): Promise<void> {
    if (selectedVault) {
      try {
        setIsSubmitting(true);
        const currentRisk = await fetchUserEthereumAddressRiskLevel();
        if (currentRisk === 'High') throw new Error('Risk Level is too high');
        const formattedWithdrawAmount = BigInt(shiftValue(withdrawAmount));
        await withdrawVault(selectedVault.uuid, formattedWithdrawAmount);
        await getVault(selectedVault.uuid, VaultState.FUNDED).then(() => {
          dispatch(mintUnmintActions.setUnmintStep([1, selectedVault.uuid]));
        });
      } catch (error) {
        setIsSubmitting(false);
        toast({
          title: 'Failed to sign Transaction',
          description: error instanceof Error ? error.message : '',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }

  function handleCancel() {
    setSelectedVault(undefined);
  }

  return (
    <>
      {selectedVault ? (
        <BurnTokenTransactionForm
          vault={selectedVault}
          bitcoinPrice={bitcoinPrice}
          isSubmitting={isSubmitting}
          risk={userEthereumAddressRiskLevel}
          isRiskLoading={isUserEthereumAddressRiskLevelLoading}
          handleBurn={handleBurn}
          handleCancel={handleCancel}
        />
      ) : fundedVaults.length == 0 ? (
        <VStack w={'45%'}>
          <Text color={'white'}>You don't have any active vaults.</Text>
        </VStack>
      ) : (
        <VStack w={'45%'}>
          <Text color={'accent.lightBlue.01'} fontSize={'md'} fontWeight={600}>
            Select vault to withdraw Bitcoin:
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
