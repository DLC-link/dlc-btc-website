import { useState } from "react";

import { HStack } from "@chakra-ui/react";
import { StepButton } from "@components/step-button/step-button";
import { VaultState } from "@models/vault";

import { exampleVaults } from "@shared/examples/example-vaults";

import { ProgressTimeline } from "../progress-timeline/progress-timeline";
import { TransactionSummary } from "../transaction-summary/transaction-summary";
import { Walkthrough } from "../walkthrough/walkthrough";
import { UnmintVaultSelector } from "./components/unmint-vault-selector";
import { UnmintLayout } from "./components/unmint.layout";

export function Unmint(): React.JSX.Element {
  const [currentStep, setCurrentStep] = useState(0);
  const exampleVault = exampleVaults.find(
    (vault) => vault.state === VaultState.CLOSING,
  );

  return (
    <UnmintLayout>
      <ProgressTimeline variant={"unmint"} currentStep={currentStep} />
      <HStack w={"100%"} alignItems={"start"} justifyContent={"space-between"}>
        <Walkthrough
          flow={"unmint"}
          bitcoinAmount={exampleVault?.collateral}
          currentStep={currentStep}
        />
        {[0].includes(currentStep) && <UnmintVaultSelector />}
        {[1].includes(currentStep) && (
          <TransactionSummary
            flow={"unmint"}
            blockchain={"bitcoin"}
            vault={exampleVault}
          />
        )}
      </HStack>
      <StepButton handleClick={() => setCurrentStep((currentStep + 1) % 2)} />
    </UnmintLayout>
  );
}
