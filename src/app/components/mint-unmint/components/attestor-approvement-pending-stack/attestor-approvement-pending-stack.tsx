import React from 'react';

import { HStack, Spinner, Text } from '@chakra-ui/react';

export function AttestorApprovementPendingStack(): React.JSX.Element {
  return (
    <HStack w={'100%'} justifyContent={'space-between'}>
      <Spinner color={'accent.lightBlue.01'} size={'md'} />
      <HStack width={'85%'}>
        <Text color={'accent.lightBlue.01'} fontSize={'sm'}>
          Please wait while we verify your transaction.
        </Text>
      </HStack>
    </HStack>
  );
}
