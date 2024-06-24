import { Button, SlideFade } from '@chakra-ui/react';

interface LedgerModalConnectButtonProps {
  error: string | undefined;
  getLedgerAddresses: () => void;
}

export function LedgerModalConnectButton({
  error,
  getLedgerAddresses,
}: LedgerModalConnectButtonProps): React.JSX.Element {
  return (
    <SlideFade in={!!error} transition={{ enter: { delay: 0.25 } }} unmountOnExit>
      <Button variant={'ledger'} onClick={() => getLedgerAddresses()}>
        Connect Ledger
      </Button>
    </SlideFade>
  );
}
