import React, { useState } from "react";

import { useLoadingDelay } from "@hooks/use-loading-delay";
import { VaultStatus } from "@models/vault";

import { ExpandedInformationStack } from "./components/expanded-information-stack/expanded-information-stack";
import { InformationStack } from "./components/information-stack";
import { ProgressBar } from "./components/progress-bar";
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
      <InformationStack
        collateral={collateral}
        state={state}
        isExpanded={isExpanded}
        handleClick={() => setIsExpanded(!isExpanded)}
      />
      <ExpandedInformationStack
        uuid={uuid}
        fundingTX={fundingTX}
        closingTX={closingTX}
        isExpanded={isExpanded}
      />
      <ProgressBar state={state} confirmedBlocks={confirmedBlocks} />
    </VaultCardLayout>
  );
}
