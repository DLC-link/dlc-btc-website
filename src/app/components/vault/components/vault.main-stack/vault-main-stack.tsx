import { Divider, HStack } from '@chakra-ui/react';

import { VaultActionButton } from './components/vault.main-stack.action-button';
import { VaultAssetInformationStack } from './components/vault.main-stack.asset-information-stack/vault.main-stack.asset-information-stack';

interface VaultMainStackProps {
  vaultTotalLockedValue: number;
  vaultTotalMintedValue: number;
  isVaultExpanded: boolean;
  handleButtonClick: () => void;
  variant?: 'select' | 'selected';
}

export function VaultMainStack({
  vaultTotalLockedValue,
  vaultTotalMintedValue,
  isVaultExpanded,
  handleButtonClick,
  variant,
}: VaultMainStackProps): React.JSX.Element {
  return (
    <HStack w={'100%'} justifyContent={'space-between'}>
      <VaultAssetInformationStack
        vaultTotalLockedValue={vaultTotalLockedValue}
        vaultTotalMintedValue={vaultTotalMintedValue}
      />
      <Divider h={'68px'} orientation={'vertical'} borderColor={'grey.01'} borderStyle={'dashed'} />
      <HStack w={'35%'}>
        <VaultActionButton
          isExpanded={isVaultExpanded}
          handleClick={() => handleButtonClick()}
          variant={variant}
        />
      </HStack>
    </HStack>
  );
}
