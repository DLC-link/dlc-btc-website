import React, { useContext, useState } from "react";

import { CustomSkeleton } from "@components/custom-skeleton/custom-skeleton";
import { useConfirmationChecker } from "@hooks/use-confirmation-checker";
import { Vault, VaultState } from "@models/vault";

import { BlockchainContext } from "../../providers/blockchain-context-provider";
import { VaultCardLayout } from "./components/vault-card.layout";
import { VaultExpandedInformation } from "./components/vault-expanded-information/vault-expanded-information";
import { VaultInformation } from "./components/vault-information";
import { VaultProgressBar } from "./components/vault-progress-bar";

interface VaultCardProps {
  vault: Vault;
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
  const blockchainContext = useContext(BlockchainContext);
  const bitcoin = blockchainContext?.bitcoin;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(isSelected ? true : false);

  async function handleLock(): Promise<void> {
    if (!vault) return;
    setIsSubmitting(true);
    try {
      await bitcoin?.fetchBitcoinContractOfferAndSendToUserWallet(vault);
    } catch (error) {
      setIsSubmitting(false);
      throw new Error("Error locking vault");
    }
  }

  const confirmations = useConfirmationChecker(
    vault?.state === VaultState.FUNDING ? vault?.fundingTX : vault?.closingTX,
    vault?.state,
  );

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
        isSubmitting={isSubmitting}
        handleClick={() => setIsExpanded(!isExpanded)}
        handleLock={handleLock}
      />
      {isExpanded && (
        <VaultExpandedInformation
          uuid={vault.uuid}
          fundingTX={vault.fundingTX}
          closingTX={vault.closingTX}
          isExpanded={isExpanded}
        />
      )}
      {[VaultState.FUNDING, VaultState.CLOSED].includes(vault.state) && (
        <VaultProgressBar
          confirmedBlocks={confirmations}
          vaultState={vault.state}
        />
      )}
    </VaultCardLayout>
  );
}
