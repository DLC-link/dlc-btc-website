import { HStack, Text, useBreakpointValue } from '@chakra-ui/react';

export function MerchantTableHeader(): React.JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <HStack pt={'15px'} w={'100%'} justifyContent={'space-between'}>
      <HStack w={isMobile ? '50%' : '250px'}>
        <Text color={'white'} fontSize={'lg'} fontWeight={800}>
          Merchant
        </Text>
      </HStack>
      <HStack w={isMobile ? '50%' : '150px'}>
        <Text color={'white'} fontSize={'lg'}>
          dlcBTC Minted
        </Text>
      </HStack>
      {!isMobile && <HStack w={'150px'} />}
    </HStack>
  );
}
