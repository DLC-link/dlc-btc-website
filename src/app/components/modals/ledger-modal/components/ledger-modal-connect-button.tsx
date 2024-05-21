import { Button, SlideFade } from '@chakra-ui/react';

interface LedgerModalConnectButtonProps {
  error: string | undefined;
  getLedgerNativeSegwitAddresses: () => void;
}

export function LedgerModalConnectButton({
  error,
  getLedgerNativeSegwitAddresses,
}: LedgerModalConnectButtonProps): React.JSX.Element {
  return (
    <SlideFade in={!!error} transition={{ enter: { delay: 0.25 } }} unmountOnExit>
      <Button variant={'ledger'} onClick={() => getLedgerNativeSegwitAddresses()}>
        Connect Ledger
      </Button>
    </SlideFade>
  );
}
