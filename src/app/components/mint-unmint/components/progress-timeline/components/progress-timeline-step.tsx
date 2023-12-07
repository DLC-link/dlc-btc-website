import { Divider, Text } from '@chakra-ui/react';

import { StepIconOne, StepIconThree, StepIconTwo } from '../../../../../../styles/icon';

interface StepProps {
  currentStep: number;
  stepIndex: number;
  isLastStep?: boolean;
  title?: string;
}

function getIconForStep(currentStep: number, stepIndex: number): React.JSX.Element {
  const properties = {
    fill: currentStep >= stepIndex ? 'rgba(7,232,216,1)' : 'rgba(255,255,255,1)',
    opacity: currentStep > stepIndex ? '50%' : '100%',
    height: '15px',
  };

  switch (stepIndex) {
    case 0:
      return <StepIconOne {...properties} />;
    case 1:
      return <StepIconTwo {...properties} />;
    case 2:
      return <StepIconThree {...properties} />;
    default:
      return <StepIconOne {...properties} />;
  }
}

export function StepGraphics({
  currentStep,
  stepIndex,
  isLastStep = false,
}: StepProps): React.JSX.Element {
  return (
    <>
      {getIconForStep(currentStep, stepIndex)}
      {!isLastStep && (
        <Divider
          orientation="horizontal"
          borderColor={currentStep > stepIndex ? 'accent.cyan.01' : 'white.03'}
          variant={currentStep > stepIndex ? 'thick' : 'thickDotted'}
          opacity={currentStep > stepIndex ? '50%' : '100%'}
        />
      )}
    </>
  );
}

export function StepText({ currentStep, stepIndex, title }: StepProps): React.JSX.Element {
  return (
    <Text
      color={currentStep >= stepIndex ? 'accent.cyan.01' : 'white.01'}
      fontSize={'xs'}
      fontWeight={currentStep === stepIndex ? 800 : 400}
      opacity={currentStep > stepIndex ? '50%' : '100%'}
    >
      {title}
    </Text>
  );
}
