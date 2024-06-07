import { HStack, Text } from '@chakra-ui/react';

export function MerchantTableHeader(): React.JSX.Element {
  return (
    <HStack px={'25px'} pt={'15px'} w={'100%'}>
      <Text w={'33.3%'} color={'white'} fontSize={'lg'} fontWeight={800}>
        Merchant
      </Text>
      <Text w={'33.3%'} color={'white'} fontSize={'lg'}>
        dlcBTC Minted
      </Text>
    </HStack>
  );
}
