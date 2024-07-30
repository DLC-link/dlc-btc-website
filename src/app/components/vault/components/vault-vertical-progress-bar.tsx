import { Divider, Image, Spinner, VStack } from '@chakra-ui/react';

interface VaultVerticalProgressBarProps {
  stateA: boolean;
  stateB: boolean;
}

const StatusIndicator: React.FC<{ state: boolean }> = ({ state }) =>
  state ? (
    <Image src={'/images/check.svg'} alt={'Icon'} boxSize={'20px'} />
  ) : (
    <Spinner size={'md'} color={'accent.lightBlue.01'} />
  );

export function VaultVerticalProgressBar({
  stateA,
  stateB,
}: VaultVerticalProgressBarProps): React.JSX.Element {
  return (
    <VStack w={'100%'} alignItems={'center'}>
      <StatusIndicator state={stateA} />
      <Divider orientation={'vertical'} height={'250px'} variant={'thick'} />
      <StatusIndicator state={stateB} />
    </VStack>
  );
}
