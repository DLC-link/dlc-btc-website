import { HStack } from "@chakra-ui/react";

import { RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { LockScreen } from "../lock-screen/lock-screen";
import { ProgressTimeline } from "../progress-timeline/progress-timeline";
import { TransactionForm } from "../transaction-form/transaction-form";
import { TransactionSummary } from "../transaction-summary/transaction-summary";
import { Walkthrough } from "../walkthrough/walkthrough";
import { MintLayout } from "./components/mint.layout";
import { StepButton } from "@components/step-button/step-button";
import { mintUnmintActions } from "@store/slices/mintunmint/mintunmint.actions";

export function Mint(): React.JSX.Element {
  const dispatch = useDispatch();
  const { mintStep } = useSelector((state: RootState) => state.mintunmint);

  function handleRestart() {
    dispatch(mintUnmintActions.setMintStep([0, '']));
  }

  return (
    <MintLayout>
      <ProgressTimeline variant={"mint"} currentStep={mintStep[0]} />
      <HStack w={"100%"} alignItems={"start"} justifyContent={"space-between"}>
        <Walkthrough flow={"mint"} currentStep={mintStep[0]} />
        {[0].includes(mintStep[0]) && <TransactionForm />}
        {[1].includes(mintStep[0]) && <LockScreen currentStep={mintStep} />}
        {[2, 3].includes(mintStep[0]) && (
          <TransactionSummary
            currentStep={mintStep}
            flow={"mint"}
            blockchain={"ethereum"}
          />
        )}
      </HStack>
      <StepButton handleClick={handleRestart} />
    </MintLayout>
  );
}
