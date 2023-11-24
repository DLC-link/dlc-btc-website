import { HStack } from "@chakra-ui/react";

import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { LockScreen } from "../lock-screen/lock-screen";
import { ProgressTimeline } from "../progress-timeline/progress-timeline";
import { TransactionForm } from "../transaction-form/transaction-form";
import { TransactionSummary } from "../transaction-summary/transaction-summary";
import { Walkthrough } from "../walkthrough/walkthrough";
import { MintLayout } from "./components/mint.layout";

export function Mint(): React.JSX.Element {
  const { mintStep } = useSelector((state: RootState) => state.mintunmint);

  return (
    <MintLayout>
      <ProgressTimeline variant={"mint"} currentStep={mintStep} />
      <HStack w={"100%"} alignItems={"start"} justifyContent={"space-between"}>
        <Walkthrough flow={"mint"} currentStep={mintStep} />
        {[0].includes(mintStep) && <TransactionForm />}
        {[1].includes(mintStep) && <LockScreen />}
        {[2].includes(mintStep) && (
          <TransactionSummary flow={"mint"} blockchain={"ethereum"} />
        )}
      </HStack>
    </MintLayout>
  );
}
