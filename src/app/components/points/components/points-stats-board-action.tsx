import { Button, HStack, Image, Skeleton, Text, VStack } from '@chakra-ui/react';
import { Token } from '@models/token';

interface PointsStatsBoardActionProps {
  token: Token;
  totalSupply: number | undefined;
}

export function PointsStatsBoardAction({
  token,
  totalSupply,
}: PointsStatsBoardActionProps): React.JSX.Element {
  let tokenSuffix: string;
  switch (token.name) {
    case 'dlcBTC':
      tokenSuffix = 'Use';
      break;
    default:
      tokenSuffix = 'Provide';
      break;
  }

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
      <Button
        w={'100%'}
        variant={'points'}
        onClick={() =>
          window.open(
            token.name === 'dlcBTC'
              ? 'https://www.dlc.link/earn-with-dlcbtc'
              : 'https://www.dlc.link/merchants',
            '_blank'
          )
        }
      >
        <Text bgGradient={`linear(to-r, #AC50EF, #7059FB, #2ECFF6)`} bgClip="text">
          {token.name === 'dlcBTC' ? 'Earn More Points' : 'Become a Merchant'}
        </Text>
      </Button>
    </VStack>
  );
}
