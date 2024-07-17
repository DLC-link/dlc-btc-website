import { HStack, Stack, Text } from '@chakra-ui/react';

export function LedgerModalSelectAddressMenuTableHeader(): React.JSX.Element {
  return (
    <HStack
      pt={'5%'}
      px={'2.5%'}
      w={'100%'}
      justifyContent={'space-between'}
      borderBottom={'1px'}
      borderColor={'white.03'}
    >
      <HStack w={'100%'} justifyContent={'space-between'}>
        <Stack w={'65%'} alignItems={'flex-start'}>
          <Text fontSize={'xs'} fontStyle={'italic'}>
            address
          </Text>
        </Stack>
        <Stack w={'35%'} alignItems={'flex-end'}>
          <Text fontSize={'xs'} fontStyle={'italic'}>
            balance
          </Text>
        </Stack>
      </HStack>
    </HStack>
  );
}
