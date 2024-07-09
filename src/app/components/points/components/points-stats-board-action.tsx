import { HStack, Image, Skeleton, Text, VStack } from '@chakra-ui/react';
import { Token } from '@models/token';

interface PointsStatsBoardActionProps {
  token: Token;
  totalSupply: number | undefined;
  tokenSuffix: string;
}

export function PointsStatsBoardAction({
  token,
  totalSupply,
  tokenSuffix,
}: PointsStatsBoardActionProps): React.JSX.Element {
  return (
    <VStack w={'100%'} h={'100%'} pr={'25px'} py={'15px'} alignItems={'start'}>
      <Skeleton isLoaded={totalSupply !== undefined} h={'100%'} w={'100%'}>
        <VStack w={'100%'} h={'85px'} alignItems={'start'} spacing={'15px'}>
          <HStack h={'25px'}>
            <Image src={token.logo} alt={token.logoAlt} boxSize={'25px'} />
            <Text color={'white'} fontWeight={200} fontSize={'md'}>
              {`${tokenSuffix} ${token.name} `}
            </Text>
          </HStack>
          <Text color={'white'} fontWeight={200} fontSize={'3xl'}>
            {totalSupply?.toFixed(2)}
          </Text>
        </VStack>
      </Skeleton>
    </VStack>
  );
}
