import React, { useState } from "react";

import { useLoadingDelay } from "@hooks/use-loading-delay";
import { Vault } from "@models/vault";

import { VaultBoxExpandedInformationStack } from "./components/vault-box-expanded-information-stack/vault-box-expanded-information-stack";
import { VaultBoxInformationStack } from "./components/vault-box-information-stack";
import { VaultBoxProgressBar } from "./components/vault-box-progress-bar";
import { VaultBoxLayout } from "./components/vault-box.layout";

export function VaultBox({
  uuid,
  collateral,
  state,
  fundingTX,
  closingTX,
}: Vault): React.JSX.Element {
  const isLoaded = useLoadingDelay(3000);
  const confirmedBlocks = 3;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <VaultBoxLayout isLoaded={isLoaded}>
      <VaultBoxInformationStack
        collateral={collateral}
        state={state}
        isExpanded={isExpanded}
        handleClick={() => setIsExpanded(!isExpanded)}
      />
      <VaultBoxExpandedInformationStack
        uuid={uuid}
        fundingTX={fundingTX}
        closingTX={closingTX}
        isExpanded={isExpanded}
      />
      <VaultBoxProgressBar state={state} confirmedBlocks={confirmedBlocks} />
    </VaultBoxLayout>
  );
}
