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
    <VStack w={'50%'} h={'100%'} alignItems={'start'}>
      <Skeleton isLoaded={totalSupply !== undefined} h={'auto'} w={'100%'}>
        <HStack>
          <Image src={token.logo} alt={token.logoAlt} boxSize={'25px'} />
          <Text color={'white'} fontWeight={600} fontSize={'md'}>
            {`${tokenSuffix} ${token.name} `}
          </Text>
        </HStack>
        <Text color={'white'} fontWeight={200} fontSize={'3xl'}>
          {totalSupply}
        </Text>
      </Skeleton>
      <Button variant={'points'} onClick={() => {}}>
        {token.name === 'dlcBTC' ? 'Earn More Points' : 'Become a Merchant'}
      </Button>
    </VStack>
  );
}
