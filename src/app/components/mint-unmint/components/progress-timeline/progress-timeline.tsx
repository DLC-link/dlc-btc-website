import { HStack, VStack } from '@chakra-ui/react';

import { StepGraphics, StepText } from './components/progress-timeline-step';

interface ProgressTimelineProps {
  variant: 'mint' | 'unmint';
  currentStep: number;
}

export function ProgressTimeline({
  variant,
  currentStep,
}: ProgressTimelineProps): React.JSX.Element {
  switch (variant) {
    case 'unmint':
      return (
        <VStack w={'100%'}>
          <HStack w={'100%'}>
            <StepGraphics currentStep={currentStep} stepIndex={0} />
            <StepGraphics currentStep={currentStep} stepIndex={1} />
            <StepGraphics currentStep={currentStep} stepIndex={2} isLastStep />
          </HStack>
          <HStack w={'100%'} spacing={'0px'}>
            <StepText
              currentStep={currentStep}
              stepIndex={0}
              title="Unmint dlcBTC"
              width={'34%'}
              isFirstStep
            />
            <StepText currentStep={currentStep} stepIndex={1} title="Wait 24 hours" width={'33%'} />
            <StepText
              currentStep={currentStep}
              stepIndex={2}
              title="Receive BTC"
              width={'33%'}
              isLastStep
            />
          </HStack>
        </VStack>
      );
    case 'mint':
      return (
        <VStack w={'100%'}>
          <HStack w={'100%'} p={'0px'}>
            <StepGraphics currentStep={currentStep} stepIndex={0} />
            <StepGraphics currentStep={currentStep} stepIndex={1} />
            <StepGraphics currentStep={currentStep} stepIndex={2} />
            <StepGraphics currentStep={currentStep} stepIndex={3} isLastStep />
          </HStack>
          <HStack w={'100%'} spacing={'0px'}>
            <StepText
              currentStep={currentStep}
              stepIndex={0}
              title="Create Vault"
              width={'15%'}
              isFirstStep
            />
            <StepText currentStep={currentStep} stepIndex={1} title="Lock BTC" width={'37%'} />
            <StepText currentStep={currentStep} stepIndex={2} title="Wait 24 hours" width={'29%'} />
            <StepText
              currentStep={currentStep}
              stepIndex={3}
              title="Mint dlcBTC"
              width={'19%'}
              isLastStep
            />
          </HStack>
        </VStack>
      );
    default:
      return <HStack w={'100%'} />;
  }
}
