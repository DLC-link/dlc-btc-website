import { Vault } from '@models/vault';

import { VaultMiniCardInformation } from './components/vault-information';
import { VaultMiniCardLayout } from './components/vault-mini-card.layout';

interface VaultMiniCardProps {
  vault: Vault;
}

export function VaultMiniCard({ vault }: VaultMiniCardProps): React.JSX.Element {
  return (
    <VaultMiniCardLayout>
      <VaultMiniCardInformation
        collateral={vault.collateral}
        uuid={vault.uuid}
        state={vault.state}
        timestamp={vault.timestamp}
      />
    </VaultMiniCardLayout>
  );
}
