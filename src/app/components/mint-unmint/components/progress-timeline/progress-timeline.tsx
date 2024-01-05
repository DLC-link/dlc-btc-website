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
          <HStack w={'100%'} spacing={'185px'}>
            <StepText currentStep={currentStep} stepIndex={0} title="Unmint dlcBTC" />
            <StepText currentStep={currentStep} stepIndex={1} title="Waiting" />
            <StepText
              currentStep={currentStep}
              stepIndex={2}
              title="Receive BTC"
              marginLeft={'15px'}
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
          <HStack w={'100%'} spacing={'90px'}>
            <StepText currentStep={currentStep} stepIndex={0} title="Create Vault" />
            <StepText currentStep={currentStep} stepIndex={1} title="Lock BTC" marginLeft={'8px'} />
            <StepText currentStep={currentStep} stepIndex={2} title="Waiting" marginLeft={'55px'} />
            <StepText
              currentStep={currentStep}
              stepIndex={3}
              title="Mint dlcBTC"
              marginLeft={'15px'}
              isLastStep
            />
          </HStack>
        </VStack>
      );
    default:
      return <HStack w={'100%'} />;
  }
}
