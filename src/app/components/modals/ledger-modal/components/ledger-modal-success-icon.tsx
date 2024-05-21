import { CheckCircleIcon } from '@chakra-ui/icons';
import { SlideFade } from '@chakra-ui/react';

interface LedgerModalSuccessIconProps {
  isSuccesful: boolean;
}

export function LedgerModalSuccessIcon({
  isSuccesful,
}: LedgerModalSuccessIconProps): React.JSX.Element {
  return (
    <SlideFade in={isSuccesful} transition={{ enter: { delay: 0.25 } }} unmountOnExit>
      <CheckCircleIcon w={'25px'} h={'25px'} color={'accent.lightBlue.01'} />
    </SlideFade>
  );
}
