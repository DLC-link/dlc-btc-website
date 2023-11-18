import { useState } from "react";

import { HStack } from "@chakra-ui/react";

import { mintStepsContent } from "@shared/constants/walkthrough-steps";

import { ProgressTimeline } from "../progress-timeline/progress-timeline";
import { TransactionForm } from "../transaction-form/transaction-form";
import { TransactionSummary } from "../transaction-summary/transaction-summary";
import { Walkthrough } from "../walkthrough/walkthrough";
import { MintLayout } from "./components/mint.layout";
import { StepButton } from "./components/step-button";

export function Mint(): React.JSX.Element {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <MintLayout>
      <ProgressTimeline variant={"mint"} currentStep={currentStep} />
      <HStack w={"100%"} alignItems={"start"} justifyContent={"space-between"}>
        <Walkthrough step={currentStep} {...mintStepsContent[currentStep]} />
        <TransactionForm currentStep={currentStep} />
        {currentStep === 2 && <TransactionSummary />}
      </HStack>
      <StepButton handleClick={() => setCurrentStep((currentStep + 1) % 3)} />
    </MintLayout>
  );
}
