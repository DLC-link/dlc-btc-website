import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Button, Text, VStack } from '@chakra-ui/react';
import { VaultCard } from '@components/vault/vault-card';
import { VaultsListGroupContainer } from '@components/vaults-list/components/vaults-list-group-container';
import { VaultsList } from '@components/vaults-list/vaults-list';
import { useEthereum } from '@hooks/use-ethereum';
import { useVaults } from '@hooks/use-vaults';
import { Vault } from '@models/vault';
import { RootState } from '@store/index';
import { scrollBarCSS } from '@styles/css-styles';

import { RiskBox } from '../../risk-box/risk-box';

interface UnmintVaultSelectorProps {
  risk: string;
  fetchRisk: () => Promise<string>;
  isRiskLoading: boolean;
}
export function UnmintVaultSelector({
  risk,
  fetchRisk,
  isRiskLoading,
}: UnmintVaultSelectorProps): React.JSX.Element {
  const { fundedVaults } = useVaults();
  const { closeVault } = useEthereum();

  const { unmintStep } = useSelector((state: RootState) => state.mintunmint);

  const [selectedVault, setSelectedVault] = useState<Vault | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSelect(uuid: string): void {
    const vault = fundedVaults.find(vault => vault.uuid === uuid);
    if (vault) setSelectedVault(vault);
  }

  useEffect(() => {
    setSelectedVault(fundedVaults.find(vault => vault.uuid === unmintStep[1]));
  }, [fundedVaults, unmintStep]);

  async function handleUnmint(): Promise<void> {
    if (selectedVault) {
      try {
        setIsSubmitting(true);
        const currentRisk = await fetchRisk();
        if (currentRisk === 'High') throw new Error('Risk Level is too high');
        await closeVault(selectedVault.uuid);
      } catch (error) {
        setIsSubmitting(false);
        throw new Error('Error closing vault');
      }
    }
  }

  return (
    <VStack alignItems={'start'} py={'2.5px'} px={'15px'} w={'45%'} h={'445px'} spacing={'15px'}>
      <Text color={'accent.lightBlue.01'} fontSize={'md'} fontWeight={600}>
        Select vault to redeem dlcBTC:
      </Text>
      {selectedVault ? (
        <VStack
          overflowY={'scroll'}
          overflowX={'hidden'}
          alignItems={'start'}
          py={'15px'}
          pr={'15px'}
          w={'100%'}
          css={scrollBarCSS}
        >
          <VaultCard
            vault={selectedVault}
            isSelectable
            isSelected
            handleSelect={() => setSelectedVault(undefined)}
          />
        </VStack>
      ) : fundedVaults.length == 0 ? (
        <Text color={'white'}>You don't have any active vaults.</Text>
      ) : (
        <VaultsList height="268.5px" isScrollable={!selectedVault}>
          <VaultsListGroupContainer
            vaults={fundedVaults}
            isSelectable
            handleSelect={handleSelect}
          />
        </VaultsList>
      )}
      <RiskBox risk={risk} isRiskLoading={isRiskLoading} />
      <Button
        isLoading={isSubmitting}
        variant={'account'}
        isDisabled={!selectedVault}
        onClick={() => handleUnmint()}
      >
        Redeem dlcBTC
      </Button>
      {selectedVault && (
        <Button
          isDisabled={risk === 'High'}
          isLoading={isSubmitting}
          variant={'navigate'}
          onClick={() => setSelectedVault(undefined)}
        >
          Cancel
        </Button>
      )}
    </VStack>
  );
}
