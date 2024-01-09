import { Divider, Text, VStack } from '@chakra-ui/react';

import {
  StepIconFour,
  StepIconOne,
  StepIconThree,
  StepIconTwo,
} from '../../../../../../styles/icon';

interface StepProps {
  currentStep: number;
  stepIndex: number;
  isLastStep?: boolean;
  isFirstStep?: boolean;
  title?: string;
  width?: string;
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
    case 3:
      return <StepIconFour {...properties} />;
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

export function StepText({
  currentStep,
  stepIndex,
  width,
  title,
  isLastStep = false,
  isFirstStep = false,
}: StepProps): React.JSX.Element {
  return (
    <VStack w={width} align={isFirstStep ? 'start' : isLastStep ? 'end' : 'center'}>
      <Text
        color={currentStep >= stepIndex ? 'accent.cyan.01' : 'white.01'}
        fontSize={'xs'}
        fontWeight={currentStep === stepIndex ? 800 : 400}
        opacity={currentStep > stepIndex ? '50%' : '100%'}
      >
        {title}
      </Text>
    </VStack>
  );
}
