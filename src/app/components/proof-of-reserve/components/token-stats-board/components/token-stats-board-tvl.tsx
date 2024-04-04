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
    <VStack w={'50%'} px={'25px'} py={'15px'} alignItems={'flex-start'}>
      <Text
        color={'accent.lightBlue.01'}
        fontSize={'lg'}
        fontWeight={'extrabold'}
        textAlign={'left'}
      >
        TVL
      </Text>
      <Skeleton w={'100%'} isLoaded={totalSupply !== undefined}>
        <Text color={'white'} fontSize={'3xl'}>
          $
          {totalSupply && bitcoinPrice ? `${(totalSupply * bitcoinPrice).toLocaleString()} USD` : 0}
        </Text>
      </Skeleton>
      <Divider h={'25px'} orientation={'horizontal'} variant={'thick'} />
    </VStack>
  );
}
