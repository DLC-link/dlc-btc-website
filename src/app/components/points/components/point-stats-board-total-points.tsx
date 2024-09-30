import { Divider, Skeleton, Text, useBreakpointValue } from '@chakra-ui/react';

import { formatNumber } from '@shared/utils';

import { TokenStatsBoardTotalPointsLayout } from './points-stats-board-total-points-layout';

interface TokenStatsBoardTotalPointsProps {
  totalPoints: number | undefined;
}

export function TokenStatsBoardTotalPoints({
  totalPoints,
}: TokenStatsBoardTotalPointsProps): React.JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <TokenStatsBoardTotalPointsLayout isMobile={isMobile}>
      <Text
        color={'white.01'}
        fontSize={['xl', '2xl', '2xl', '3xl', '3xl']}
        fontWeight={'200'}
        textAlign={'left'}
      >
        You've Earned
      </Text>
      <Skeleton w={'100%'} isLoaded={totalPoints !== undefined}>
        {totalPoints !== undefined ? (
          <Text
            fontSize={'5xl'}
            fontWeight={600}
            bgGradient={`linear(to-r, #AC50EF, #7059FB, #2ECFF6)`}
            bgClip="text"
          >
            {formatNumber(totalPoints)} Points
          </Text>
        ) : (
          <Text fontSize={isMobile ? '3xl' : '5xl'} fontWeight={600} color={'gray.500'}>
            Loading...
          </Text>
        )}
      </Skeleton>
      <Divider orientation={'horizontal'} variant={'thick'} />
    </TokenStatsBoardTotalPointsLayout>
  );
}
