import { Divider, Image, Spinner, VStack } from '@chakra-ui/react';

export enum Status {
  Completed = 'completed',
  Current = 'current',
  Inactive = 'inactive',
}

interface VaultVerticalProgressBarProps {
  statusA: Status;
  statusB: Status;
}

const StatusIndicator = {
  status: Status.Inactive,

  getComponent: (status: Status) => {
    switch (status) {
      case Status.Completed:
        return <Image src={'/images/check.svg'} alt={'Icon'} boxSize={'20px'} />;
      case Status.Current:
        return <Spinner size={'md'} color={'accent.lightBlue.01'} />;
      case Status.Inactive:
        return <Image src={'/images/loader.svg'} alt={'Inactive Loader'} boxSize={'20px'} />; // Customize spinner as needed
      default:
        return null;
    }
  },
};

export function VaultVerticalProgressBar({
  statusA,
  statusB,
}: VaultVerticalProgressBarProps): React.JSX.Element {
  return (
    <VStack w={'100%'} alignItems={'center'}>
      {StatusIndicator.getComponent(statusA)}
      <Divider orientation={'vertical'} height={'150px'} variant={'thick'} />
      {StatusIndicator.getComponent(statusB)}
    </VStack>
  );
}
