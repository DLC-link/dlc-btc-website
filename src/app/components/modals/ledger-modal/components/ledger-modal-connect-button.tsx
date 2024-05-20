import { Button, ScaleFade } from '@chakra-ui/react';

interface LedgerModalConnectButtonProps {
  error: string | undefined;
  getLedgerNativeSegwitAddresses: () => void;
}

export function LedgerModalConnectButton({
  error,
  getLedgerNativeSegwitAddresses,
}: LedgerModalConnectButtonProps): React.JSX.Element {
  return (
    <ScaleFade in={!!error} unmountOnExit>
      <Button variant={'ledger'} onClick={() => getLedgerNativeSegwitAddresses()}>
        Connect Ledger
      </Button>
    </ScaleFade>
  );
}
