import { HStack, Image, Skeleton, Text, VStack } from '@chakra-ui/react';
import { Token } from '@models/token';

interface TokenStatsBoardTokenProps {
  token: Token;
  totalSupply: number | undefined;
}

export function TokenStatsBoardToken({
  token,
  totalSupply,
}: TokenStatsBoardTokenProps): React.JSX.Element {
  let tokenSuffix: string;
  switch (token.name) {
    case 'dlcBTC':
      tokenSuffix = 'Minted';
      break;
    default:
      tokenSuffix = 'Reserve';
      break;
  }

  return (
    <VStack w={'50%'} h={'100%'} alignItems={'start'}>
      <Text color={'accent.lightBlue.01'} fontWeight={600} fontSize={'md'}>
        {`${token.name} ${tokenSuffix}`}
      </Text>
      <Skeleton isLoaded={totalSupply !== undefined} h={'auto'} w={'100%'}>
        <HStack>
          <Image src={token.logo} alt={token.logoAlt} boxSize={'25px'} />
          <Text color={'white'} fontWeight={200} fontSize={'3xl'}>
            {totalSupply}
          </Text>
        </HStack>
      </Skeleton>
    </VStack>
  );
}
