import { Divider, HStack } from '@chakra-ui/react';
import { VaultState } from 'dlc-btc-lib/models';

import { VaultActionButton } from './components/vault.main-stack.action-button';
import { VaultAssetInformationStack } from './components/vault.main-stack.asset-information-stack/vault.main-stack.asset-information-stack';

interface VaultMainStackProps {
  vaultState: VaultState;
  vaultTotalLockedValue: number;
  vaultTotalMintedValue: number;
  isVaultExpanded: boolean;
  handleButtonClick: () => void;
  variant?: 'select' | 'selected';
}

export function VaultMainStack({
  vaultState,
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
      {!(variant === 'selected' && vaultState === VaultState.READY) && (
        <>
          <Divider
            h={'68px'}
            orientation={'vertical'}
            borderColor={'grey.01'}
            borderStyle={'dashed'}
          />
          <HStack w={'35%'}>
            <VaultActionButton
              isExpanded={isVaultExpanded}
              handleClick={() => handleButtonClick()}
              variant={variant}
            />
          </HStack>
        </>
      )}
    </HStack>
  );
}
