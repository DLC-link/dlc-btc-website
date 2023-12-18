import { useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

import { Box, Skeleton, VStack } from '@chakra-ui/react';

interface IntroVideoProps {
  opts: YouTubeProps['opts'];
  placeholderHeight: string;
  placeholderWidth: string;
}

export function IntroVideo({
  opts,
  placeholderHeight,
  placeholderWidth,
}: IntroVideoProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const onPlayerReady: YouTubeProps['onReady'] = event => {
    event.target.pauseVideo();
    setIsLoading(false);
  };

  return (
    <VStack>
      <Skeleton
        isLoaded={!isLoading}
        startColor={'white.02'}
        endColor={'white.03'}
        h={placeholderHeight}
        w={placeholderWidth}
      >
        <Box borderRadius={'lg'} overflow={'hidden'} width={'100%'} maxW={'500px'}>
          <YouTube videoId="x9D1owU1tB8" opts={opts} onReady={onPlayerReady} />
        </Box>
      </Skeleton>
    </VStack>
  );
}
