import { Divider, Image, Spinner, Stack, VStack } from '@chakra-ui/react';

interface VaultVerticalProgressBarProps {
  flow: 'mint' | 'burn';
  currentStep: number;
  confirmations?: number;
  variant?: 'small';
}

const Status = {
  ACTIVE: 'ACTIVE',
  PROGRESSING: 'PROGRESSING',
  COMPLETED: 'COMPLETED',
  INACTIVE: 'INACTIVE',
};

function getStatus(currentStep: number, stepIndex: number, progressing: boolean): string {
  if (currentStep === stepIndex) {
    return progressing ? Status.PROGRESSING : Status.ACTIVE;
  } else if (currentStep > stepIndex) {
    return Status.COMPLETED;
  } else {
    return Status.INACTIVE;
  }
}

function getComponent(status: string): React.JSX.Element | false {
  switch (status) {
    case Status.ACTIVE:
      return <Image src={'/images/loader-colored.svg'} alt={'Active Loader'} boxSize={'15px'} />;
    case Status.PROGRESSING:
      return <Spinner thickness={'3.5px'} size={'xs'} color={'accent.lightBlue.01'} />;
    case Status.COMPLETED:
      return <Image src={'/images/check.svg'} alt={'Icon'} boxSize={'15px'} />;
    case Status.INACTIVE:
      return <Image src={'/images/loader.svg'} alt={'Inactive Loader'} boxSize={'15px'} />;
    default:
      return false;
  }
}

export function VaultVerticalProgressBar({
  flow,
  currentStep,
  confirmations = 0,
}: VaultVerticalProgressBarProps): React.JSX.Element {
  const isMintFlow = flow === 'mint';
  const isBurnFlow = flow === 'burn';

  const activeStatus =
    (isMintFlow && [1, 2].includes(currentStep) && confirmations < 6) ||
    (isBurnFlow && currentStep === 0)
      ? 0
      : 1;

  const height =
    (isMintFlow && currentStep !== 1) || (isBurnFlow && currentStep !== 0) ? '125px' : '185px';

  return (
    <Stack w="15%" h="100%">
      <VStack py="25%" h={height} justifyContent="space-between">
        <Stack>{getComponent(getStatus(activeStatus, 0, currentStep === 2))}</Stack>
        <Divider orientation="vertical" variant="thick" />
        <Stack>{getComponent(getStatus(activeStatus, 1, currentStep === 2))}</Stack>
      </VStack>
    </Stack>
  );
}
