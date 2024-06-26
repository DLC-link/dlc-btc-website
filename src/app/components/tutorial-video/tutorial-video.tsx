import { useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

import { Skeleton, Text, VStack } from '@chakra-ui/react';

export function TutorialVideo(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const onPlayerReady: YouTubeProps['onReady'] = event => {
    event.target.pauseVideo();
    setIsLoading(false);
  };

  const opts: YouTubeProps['opts'] = {
    height: '220',
    width: '400',
    playerVars: {
      autoplay: 0,
      controls: 1,
    },
  };

  return (
    <VStack alignItems={'start'}>
      <Text color={'accent.lightBlue.01'} fontSize={'md'}>
        Watch explainer video:
      </Text>
      <Skeleton
        isLoaded={!isLoading}
        startColor={'white.02'}
        endColor={'white.03'}
        h={'220px'}
        w={'410px'}
      >
        <VStack
          justifyContent={'center'}
          w={'410px'}
          border={'2.5px solid'}
          borderColor={'border.white.01'}
          borderRadius={'lg'}
        >
          <YouTube videoId="n4lIVEujhH4" opts={opts} onReady={onPlayerReady} />
        </VStack>
      </Skeleton>
    </VStack>
  );
}
