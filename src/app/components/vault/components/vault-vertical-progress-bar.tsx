import { Divider, HStack, Image, Spinner, Stack, VStack } from '@chakra-ui/react';

interface VaultVerticalProgressBarProps {
  currentStep: number;
}
const Status = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  INACTIVE: 'INACTIVE',
};

function getStatus(currentStep: number, stepIndex: number): string {
  if (currentStep === stepIndex) {
    return Status.ACTIVE;
  } else if (currentStep > stepIndex) {
    return Status.COMPLETED;
  } else {
    return Status.INACTIVE;
  }
}

function getComponent(status: string): React.JSX.Element | false {
  switch (status) {
    case Status.ACTIVE:
      return <Spinner thickness={'2.5px'} size={'xs'} color={'accent.lightBlue.01'} />;
    case Status.COMPLETED:
      return <Image src={'/images/check.svg'} alt={'Icon'} boxSize={'15px'} />;
    case Status.INACTIVE:
      return <Image src={'/images/loader.svg'} alt={'Inactive Loader'} boxSize={'15px'} />;
    default:
      return false;
  }
}

export function VaultVerticalProgressBar({
  currentStep,
}: VaultVerticalProgressBarProps): React.JSX.Element {
  return (
    <Stack w={'15%'} h={'100%'}>
      <VStack py={'25%'} h={'100%'} justifyContent={'space-between'}>
        <Stack>{getComponent(getStatus(currentStep, 0))}</Stack>
        <Divider orientation={'vertical'} variant={'thick'} />
        <Stack>{getComponent(getStatus(currentStep, 1))}</Stack>
      </VStack>
    </Stack>
  );
}
