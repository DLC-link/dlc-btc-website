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
            <StepGraphics currentStep={currentStep} stepIndex={1} isLastStep />
          </HStack>
          <HStack w={'100%'} justifyContent={'space-between'}>
            <StepText currentStep={currentStep} stepIndex={0} title="Unmint dlcBTC" />
            <StepText currentStep={currentStep} stepIndex={1} title="Receive BTC" />
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
          <HStack w={'100%'} justifyContent={'space-between'}>
            <StepText
              currentStep={currentStep}
              stepIndex={0}
              width={'13.5%'}
              isFirstStep
              title="Create Vault"
            />
            <StepText currentStep={currentStep} stepIndex={1} width={'25%'} title="Lock BTC" />
            <StepText
              currentStep={currentStep}
              stepIndex={2}
              width={'26%'}
              title="Sign Closing TX"
            />
            <StepText
              currentStep={currentStep}
              stepIndex={3}
              width={'12.5%'}
              isLastStep
              title="Mint dlcBTC"
            />
          </HStack>
        </VStack>
      );
    default:
      return <HStack w={'100%'} />;
  }
}
