import { useState } from "react";

import { HStack } from "@chakra-ui/react";
import { StepButton } from "@components/step-button/step-button";
import { VaultStatus } from "@models/vault";

import { exampleVaults } from "@shared/examples/example-vaults";

import { LockScreen } from "../lock-screen/lock-screen";
import { ProgressTimeline } from "../progress-timeline/progress-timeline";
import { TransactionForm } from "../transaction-form/transaction-form";
import { TransactionSummary } from "../transaction-summary/transaction-summary";
import { Walkthrough } from "../walkthrough/walkthrough";
import { MintLayout } from "./components/mint.layout";

export function Mint(): React.JSX.Element {
  const [currentStep, setCurrentStep] = useState(0);
  const exampleVault = exampleVaults.find(
    (vault) => vault.state === VaultStatus.FUNDING,
  );

  return (
    <MintLayout>
      <ProgressTimeline variant={"mint"} currentStep={currentStep} />
      <HStack w={"100%"} alignItems={"start"} justifyContent={"space-between"}>
        <Walkthrough flow={"mint"} currentStep={currentStep} />
        {[0].includes(currentStep) && <TransactionForm />}
        {[1].includes(currentStep) && <LockScreen />}
        {[2].includes(currentStep) && (
          <TransactionSummary
            flow={"mint"}
            blockchain={"ethereum"}
            vault={exampleVault}
          />
        )}
      </HStack>
      <StepButton handleClick={() => setCurrentStep((currentStep + 1) % 3)} />
    </MintLayout>
  );
}
