import { HStack, Spinner, Text } from '@chakra-ui/react';

interface LedgerModalLoadingStackProps {
  isLoading: [boolean, string];
}
export function LedgerModalLoadingStack({
  isLoading,
}: LedgerModalLoadingStackProps): React.JSX.Element | false {
  return (
    isLoading[0] && (
      <HStack
        py={'5%'}
        w={'375px'}
        spacing={4}
        bgColor={'background.content.01'}
        justifyContent={'center'}
      >
        <Text fontFamily={'Inter'} fontSize={'sm'} fontWeight={'600'}>
          {isLoading[1]}
        </Text>
        <Spinner size={'sm'} />
      </HStack>
    )
  );
}
