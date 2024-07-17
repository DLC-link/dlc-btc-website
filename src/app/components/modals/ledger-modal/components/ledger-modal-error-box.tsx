import { HStack, Text } from '@chakra-ui/react';

interface LedgerModalErrorBoxProps {
  error: string | undefined;
}

function formatErrorMessage(error: string): string {
  if (error.includes('0x6985')) {
    return 'Action Rejected by User';
  } else if (error.includes('0x5515')) {
    return 'Locked Device';
  } else {
    return error;
  }
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
