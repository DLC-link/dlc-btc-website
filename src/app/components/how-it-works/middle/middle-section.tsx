import { Box, HStack, Text } from '@chakra-ui/react';

import { ExplanationBlock } from './components/explanation-block';

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
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <HStack width={'1000px'} justifyContent={'space-between'}>
        <ExplanationBlock
          src={'/images/mint-btc-grad.png'}
          title={'What is dlcBTC?'}
          content={
            <Text color={'white'}>
              dlcBTC is a{' '}
              <Box as={'span'} fontWeight={'bold'}>
                non-custodial
              </Box>{' '}
              representation of Bitcoin on the Ethereum blockchain.
            </Text>
          }
        ></ExplanationBlock>
        <ExplanationBlock
          src={'/images/dlc-img.png'}
          title={'How Does It Work?'}
          content={
            <Text color={'white'}>
              <Text as={'span'} variant={'navigate'}>
                Discreet Log Contracts (DLCs)
              </Text>{' '}
              ensure only authorized parties can access locked Bitcoin, without third-party risks.
            </Text>
          }
        ></ExplanationBlock>
        <ExplanationBlock
          src={'/images/unmint-btc-grad.png'}
          title={'Why is It Safer?'}
          content={
            <Text color={'white'}>
              Your Bitcoin remains secure on its native chain and cannot be redirected or stolen.
            </Text>
          }
        ></ExplanationBlock>
      </HStack>
    </Box>
  );
}
