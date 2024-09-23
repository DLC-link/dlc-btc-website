import { VStack } from '@chakra-ui/react';

import { VaultAssetRow } from './components/vault.main-stack.asset-information-stack.asset-row';

interface VaultAssetInformationStackProps {
  vaultTotalLockedValue: number;
  vaultTotalMintedValue: number;
}
export function VaultAssetInformationStack({
  vaultTotalLockedValue,
  vaultTotalMintedValue,
}: VaultAssetInformationStackProps): React.JSX.Element {
  return (
    <VStack w={'50%'}>
      <VaultAssetRow
        assetLogo={'images/logos/dlc-btc-logo.svg'}
        assetValue={vaultTotalMintedValue}
        assetSymbol={'BTC'}
      />
      <VaultAssetRow
        assetLogo={'images/logos/bitcoin-logo.svg'}
        assetValue={vaultTotalLockedValue}
        assetSymbol={'dlcBTC'}
      />
    </VStack>
  );
}
