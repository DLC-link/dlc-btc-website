import { HStack, Text } from '@chakra-ui/react';

export function MerchantTableHeader(): React.JSX.Element {
  return (
    <HStack px={'25px'} pt={'15px'} w={'100%'} justifyContent={'space-between'}>
      <HStack w={'150px'}>
        <Text color={'white'} fontSize={'lg'} fontWeight={800}>
          Merchant
        </Text>
      </HStack>
      <HStack w={'150px'}>
        <Text color={'white'} fontSize={'lg'}>
          dlcBTC Minted
        </Text>
      </HStack>
      <HStack w={'150px'} />
    </HStack>
  );
}
