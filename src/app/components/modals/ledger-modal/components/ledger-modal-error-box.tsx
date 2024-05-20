import { HStack, ScaleFade, Text } from '@chakra-ui/react';

interface LedgerModalErrorBoxProps {
  error: string | undefined;
}

export function LedgerModalErrorBox({ error }: LedgerModalErrorBoxProps): React.JSX.Element {
  return (
    <ScaleFade in={!!error} transition={{ enter: { delay: 0.25 } }} unmountOnExit>
      <HStack p={'5%'} w={'375px'} spacing={4} bgColor={'red'} justifyContent={'center'}>
        <Text fontFamily={'Inter'} fontSize={'xs'} fontWeight={'600'}>
          {error}
        </Text>
      </HStack>
    </ScaleFade>
  );
}
