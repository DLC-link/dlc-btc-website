import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Text, VStack, useToast } from '@chakra-ui/react';
import { VaultsListGroupContainer } from '@components/vaults-list/components/vaults-list-group-container';
import { VaultsList } from '@components/vaults-list/vaults-list';
import { useEthereum } from '@hooks/use-ethereum';
import { useVaults } from '@hooks/use-vaults';
import { Vault } from '@models/vault';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { shiftValue } from 'dlc-btc-lib/utilities';

import { BurnTokenTransactionForm } from '../../sign-transaction-screen/components/ethereum-transaction-form';

interface UnmintVaultSelectorProps {
  risk: string;
  isRiskLoading: boolean;
}

export function UnmintVaultSelector({
  risk,
  isRiskLoading,
}: UnmintVaultSelectorProps): React.JSX.Element {
  const toast = useToast();
  const dispatch = useDispatch();
  const { withdrawVault } = useEthereum();

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

  async function handleBurn(withdrawAmount: number): Promise<void> {
    if (selectedVault) {
      try {
        setIsSubmitting(true);
        // const currentRisk = await fetchRisk();
        // if (currentRisk === 'High') throw new Error('Risk Level is too high');
        const formattedWithdrawAmount = BigInt(shiftValue(withdrawAmount));
        await withdrawVault(selectedVault.uuid, formattedWithdrawAmount);
        dispatch(mintUnmintActions.setUnmintStep([1, selectedVault.uuid]));
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
          risk={risk}
          isRiskLoading={isRiskLoading}
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
            Select vault to withdraw dlcBTC:
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
