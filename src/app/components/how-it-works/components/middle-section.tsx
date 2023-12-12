import { Box, HStack, Text, VStack } from '@chakra-ui/react';

export function MiddleSection(): React.JSX.Element {
  return (
    <Box
      px={'25px'}
      minW={'100vw'}
      h={'362px'}
      paddingInlineStart={'130px'}
      paddingInlineEnd={'130px'}
      background={'rgba(255,255,255,0.06)'}
      backgroundRepeat={'no-repeat'}
      backgroundPosition={'0% 0%'}
      boxShadow={'6px 6px 12px #0000004D'}
      mixBlendMode={'screen'}
    >
      <HStack gap={'84px'}>
        <VStack align={'left'}>
          <Text color={'white.01'} fontSize={'56px'} fontWeight={'bold'}>
            dlcBTC
          </Text>
          <Text color={'white.01'} fontSize={'21px'} width={'462px'}>
            dlcBTC lets you use your Bitcoin on different DeFi platforms, all without giving up
            control of your actual Bitcoin.
          </Text>
        </VStack>
        <Box w={'486px'} h={'274px'} backgroundColor={'white.02'}></Box>
      </HStack>
    </Box>
  );
}
