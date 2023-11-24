import React, { useState } from "react";

import { CustomSkeleton } from "@components/custom-skeleton/custom-skeleton";
import { Vault, VaultState } from "@models/vault";

import { VaultCardLayout } from "./components/vault-card.layout";
import { VaultExpandedInformation } from "./components/vault-expanded-information/vault-expanded-information";
import { VaultInformation } from "./components/vault-information";
import { VaultProgressBar } from "./components/vault-progress-bar";

interface VaultBoxProps {
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
}: VaultBoxProps): React.JSX.Element {
  const confirmedBlocks = 3;
  const [isExpanded, setIsExpanded] = useState(isSelected ? true : false);

  if (!vault) return <CustomSkeleton height={"65px"} />;

  return (
    <VaultCardLayout
      isSelectable={isSelectable}
      handleClick={() => handleSelect && handleSelect()}
    >
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
          fundingTX={vault.fundingTX}
          closingTX={vault.closingTX}
          isExpanded={isExpanded}
        />
      )}
      {[VaultState.FUNDING, VaultState.CLOSING].includes(vault.state) && (
        <VaultProgressBar confirmedBlocks={confirmedBlocks} />
      )}
    </VaultCardLayout>
  );
}
