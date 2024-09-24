import { HStack, Image, Stack, Text, VStack } from '@chakra-ui/react';

interface TransactionFormProgressStackProps {
  label: string;
  assetLogo: string;
  assetSymbol: string;
  isActive: boolean;
}

export function TransactionFormProgressStack({
  label,
  assetLogo,
  assetSymbol,
  isActive,
}: TransactionFormProgressStackProps): React.JSX.Element {
  return (
    <HStack
      w={'100%'}
      p={'15px'}
      bg={'white.04'}
      border={'1px solid'}
      borderColor={'white.03'}
      borderRadius={'md'}
      opacity={isActive ? '100%' : '50%'}
    >
      <HStack w={'65%'}>
        <Image src={assetLogo} alt={'Asset Logo'} boxSize={'25px'} />
        <Stack>
          <Text color={'white.01'}>{label}</Text>
        </Stack>
      </HStack>
      <Text fontSize={'sm'} fontWeight={'bold'} color={'white.01'}>
        {assetSymbol}
      </Text>
    </HStack>
  );
}
