import React, { useState } from 'react';

import { CustomSkeleton } from '@components/custom-skeleton/custom-skeleton';
import { useConfirmationChecker } from '@hooks/use-confirmation-checker';
import { Vault, VaultState } from '@models/vault';

import { VaultCardLayout } from './components/vault-card.layout';
import { VaultExpandedInformation } from './components/vault-expanded-information/vault-expanded-information';
import { VaultInformation } from './components/vault-information';
import { VaultProgressBar } from './components/vault-progress-bar';

interface VaultCardProps {
  vault?: Vault;
  isSelected?: boolean;
  isSelectable?: boolean;
  handleSelect?: () => void;
}

export function VaultCard({
  vault,
  isSelected = false,
  isSelectable = false,
  handleSelect,
}: VaultCardProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(isSelected ? true : false);

  const confirmations = useConfirmationChecker(vault);

  if (!vault) return <CustomSkeleton height={'65px'} />;

  return (
    <VaultCardLayout isSelectable={isSelectable} handleClick={() => handleSelect && handleSelect()}>
      <VaultInformation
        collateral={vault.collateral}
        state={vault.state}
        timestamp={vault.timestamp}
        isExpanded={isExpanded}
        isSelected={isSelected}
        isSelectable={isSelectable}
        handleClick={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <VaultExpandedInformation
          uuid={vault.uuid}
          state={vault.state}
          fundingTX={vault.fundingTX}
          closingTX={vault.closingTX}
          isExpanded={isExpanded}
          isSelected={isSelected}
          close={() => setIsExpanded(false)}
        />
      )}
      {[VaultState.FUNDING, VaultState.CLOSED].includes(vault.state) && (
        <VaultProgressBar confirmedBlocks={confirmations} vaultState={vault.state} />
      )}
    </VaultCardLayout>
  );
}
