import { HStack, Text } from '@chakra-ui/react';

interface LedgerModalErrorBoxProps {
  error: string | undefined;
}

function formatErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    '0x6985': 'Action Rejected by User',
    '0x5515': 'Locked Device',
    '0x6a80':
      "Invalid data received. Please ensure your Ledger hardware's firmware and Bitcoin app are up to date",
  };

  for (const [code, message] of Object.entries(errorMessages)) {
    if (error.includes(code)) {
      return message;
    }
  }
  return error;
}

export function LedgerModalErrorBox({
  error,
}: LedgerModalErrorBoxProps): React.JSX.Element | false {
  return (
    !!error && (
      <HStack p={'5%'} w={'375px'} spacing={4} bgColor={'red'} justifyContent={'center'}>
        <Text fontFamily={'Inter'} fontSize={'xs'} fontWeight={'600'}>
          {formatErrorMessage(error || '')}
        </Text>
      </HStack>
    )
  );
}
