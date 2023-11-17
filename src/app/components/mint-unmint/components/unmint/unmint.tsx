import { useState } from "react";

import { StepButton } from "../mint/components/step-button";
import { ProgressTimeline } from "../progress-timeline/progress-timeline";
import { UnmintLayout } from "./components/unmint.layout";

export function Unmint(): React.JSX.Element {
  const [currentStep, setCurrentStep] = useState(1);
  return (
    <UnmintLayout>
      <ProgressTimeline variant={"unmint"} currentStep={currentStep} />
      <StepButton handleClick={() => setCurrentStep((currentStep + 1) % 3)} />
    </UnmintLayout>
  );
}
