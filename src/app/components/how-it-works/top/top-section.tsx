import { Box, HStack, Text, VStack } from '@chakra-ui/react';

import { IntroVideo } from './components/intro-video';

export function TopSection(): React.JSX.Element {
  return (
    <Box w={'1280px'} h={'274px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
      <HStack width={'1000px'} justifyContent={'space-between'}>
        <VStack align={'left'}>
          <Text color={'white.01'} fontSize={'56px'} fontWeight={'bold'}>
            dlcBTC
          </Text>
          <Text color={'white.01'} fontSize={'21px'} width={'462px'}>
            dlcBTC lets you use your Bitcoin on different DeFi platforms, all without giving up
            control of your actual Bitcoin.
          </Text>
        </VStack>
        <IntroVideo
          opts={{ height: '274px', width: '486px', playerVars: { autoplay: 0, controls: 1 } }}
          placeholderHeight={'274px'}
          placeholderWidth={'486px'}
        />
      </HStack>
    </Box>
  );
}
