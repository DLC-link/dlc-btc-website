import React, { useState } from "react";

import { useLoadingDelay } from "@hooks/use-loading-delay";
import { VaultStatus } from "@models/vault";

import { VaultCardExpandedInformationStack } from "./components/vault-box-expanded-information-stack/vault-box-expanded-information-stack";
import { VaultCardInformationStack } from "./components/vault-card-connect-wallet-stack";
import { VaultCardProgressBar } from "./components/vault-card-progress-bar";
import { VaultCardLayout } from "./components/vault-card.layout";

interface VaultBoxProps {
  uuid: string;
  collateral: number;
  state: VaultStatus;
  fundingTX: string;
  closingTX: string;
  preventLoad?: boolean;
}

export function VaultCard({
  uuid,
  collateral,
  state,
  fundingTX,
  closingTX,
}: VaultBoxProps): React.JSX.Element {
  const isLoaded = useLoadingDelay(3000);
  const confirmedBlocks = 3;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <VaultCardLayout isLoaded={isLoaded}>
      <VaultCardInformationStack
        collateral={collateral}
        state={state}
        isExpanded={isExpanded}
        handleClick={() => setIsExpanded(!isExpanded)}
      />
      <VaultCardExpandedInformationStack
        uuid={uuid}
        fundingTX={fundingTX}
        closingTX={closingTX}
        isExpanded={isExpanded}
      />
      <VaultCardProgressBar state={state} confirmedBlocks={confirmedBlocks} />
    </VaultCardLayout>
  );
}
