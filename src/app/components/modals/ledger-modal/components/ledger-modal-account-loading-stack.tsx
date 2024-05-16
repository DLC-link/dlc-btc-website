import { HStack, Spinner, Text } from '@chakra-ui/react';

export function LedgerLoadingFlag({ text }: { text: string }): React.JSX.Element {
  return (
    <HStack
      py={'5%'}
      w={'375px'}
      spacing={4}
      bgColor={'background.content.01'}
      justifyContent={'center'}
    >
      <Text fontFamily={''} fontSize={'sm'} fontWeight={'600'}>
        {text}
      </Text>
      <Spinner size={'sm'} />
    </HStack>
  );
}
