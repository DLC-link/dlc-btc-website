import { Button } from '@chakra-ui/react';

interface LedgerModalConnectButtonProps {
  error: string | undefined;
  getLedgerAddresses: () => void;
}

export function LedgerModalConnectButton({
  error,
  getLedgerAddresses,
}: LedgerModalConnectButtonProps): React.JSX.Element | false {
  return (
    !!error && (
      <Button variant={'ledger'} onClick={() => getLedgerAddresses()}>
        Connect Ledger
      </Button>
    )
  );
}
