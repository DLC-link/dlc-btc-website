import { Divider, Skeleton, Text, VStack } from '@chakra-ui/react';

interface TokenStatsBoardTotalPointsProps {
  totalPoints: number | undefined;
}

export function TokenStatsBoardTotalPoints({
  totalPoints,
}: TokenStatsBoardTotalPointsProps): React.JSX.Element {
  return (
    <VStack w={'50%'} px={'25px'} py={'15px'} alignItems={'flex-start'}>
      <Text color={'white.01'} fontSize={'3xl'} fontWeight={'200'} textAlign={'left'}>
        You've Earned
      </Text>
      <Skeleton w={'100%'} isLoaded={totalPoints !== undefined}>
        <Text
          fontSize={'5xl'}
          fontWeight={600}
          bgGradient={`linear(to-r, #AC50EF, #7059FB, #2ECFF6)`}
          bgClip="text"
        >
          {totalPoints?.toFixed(2)} Points
        </Text>
      </Skeleton>
      <Divider h={'25px'} orientation={'horizontal'} variant={'thick'} />
    </VStack>
  );
}
