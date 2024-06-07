import { Divider, Skeleton, Text, VStack } from '@chakra-ui/react';

interface TokenStatsBoardTVLProps {
  totalSupply: number | undefined;
  bitcoinPrice: number | undefined;
}

export function TokenStatsBoardTVL({
  totalSupply,
  bitcoinPrice,
}: TokenStatsBoardTVLProps): React.JSX.Element {
  return (
    <VStack w={'100%'} px={'25px'} py={'15px'} alignItems={'flex-start'}>
      <Text color={'white.01'} fontSize={'3xl'} fontWeight={'200'} textAlign={'left'}>
        TVL
      </Text>
      <Skeleton w={'100%'} isLoaded={totalSupply !== undefined}>
        <Text
          fontSize={'5xl'}
          fontWeight={600}
          bgGradient={`linear(to-r, #AC50EF, #7059FB, #2ECFF6)`}
          bgClip="text"
        >
          $
          {totalSupply && bitcoinPrice ? `${(totalSupply * bitcoinPrice).toLocaleString()} USD` : 0}
        </Text>
      </Skeleton>
      <Divider h={'25px'} orientation={'horizontal'} variant={'thick'} />
    </VStack>
  );
}
