import { HStack, Spinner, Text, VStack } from '@chakra-ui/react';
import { VaultCard } from '@components/vault/vault-card';
import { Vault } from '@models/vault';

interface VaultsListGroupContainerProps {
  label?: string;
  vaults: Vault[];
  selectedVaultUUID?: string;
  isSelectable?: boolean;
  handleSelect?: (uuid: string) => void;
}

export function VaultsListGroupContainer({
  label,
  vaults,
  selectedVaultUUID,
  isSelectable = false,
  handleSelect,
}: VaultsListGroupContainerProps): React.JSX.Element | boolean {
  if (vaults.length === 0) return false;

  return (
    <VStack pt={'15px'} alignItems={'start'} w={'100%'} spacing={'15px'}>
      {label && (
        <HStack pt={'15px'} spacing={'25px'}>
          {['Locking BTC in Progress', 'Unlocking BTC in Progress'].includes(label) && (
            <Spinner color={'accent.cyan.01'} size={'md'} />
          )}
          <Text color={'white'}>{label}</Text>
        </HStack>
      )}
      {vaults.map((vault, index) => (
        <VaultCard
          key={index}
          vault={vault}
          isSelected={selectedVaultUUID === vault.uuid}
          isSelectable={isSelectable}
          handleSelect={() => handleSelect && handleSelect(vault.uuid)}
        />
      ))}
    </VStack>
  );
}
