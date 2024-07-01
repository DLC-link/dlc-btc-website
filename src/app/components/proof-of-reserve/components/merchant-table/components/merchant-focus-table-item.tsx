/* eslint-disable */
import { HStack, Text } from '@chakra-ui/react';
import { CustomSkeleton } from '@components/custom-skeleton/custom-skeleton';

interface MerchantFocusTableItemProps {
  id: string;
  orderBook: string;
  amount: string;
  inUSD: string;
  txNumber: string;
  date: string;
}

export function MerchantFocusTableItem(
  merchantFocusTableItem: MerchantFocusTableItemProps
): React.JSX.Element {
  if (!merchantFocusTableItem) return <CustomSkeleton height={'35px'} />;

  const { orderBook, amount, inUSD, txNumber, date } = merchantFocusTableItem;

  return (
    <HStack
      p={'10px'}
      w={'100%'}
      h={'50px'}
      bg={'background.content.01'}
      blendMode={'screen'}
      border={'1px solid'}
      borderRadius={'md'}
      borderColor={'border.white.01'}
      justifyContent={'space-between'}
    >
      <Text w={'20%'} color={'white'} fontSize={'sm'} fontWeight={500}>
        {orderBook}
      </Text>
      <Text w={'20%'} color={'white'} fontSize={'sm'} fontWeight={800}>
        {amount}
      </Text>
      <Text w={'20%'} color={'white'} fontSize={'sm'}>
        {inUSD}
      </Text>
      <Text w={'20%'} color={'white'} fontSize={'sm'}>
        {txNumber}
      </Text>
      <Text w={'20%'} color={'white'} fontSize={'sm'}>
        {date}
      </Text>
    </HStack>
  );
}
