/* eslint-disable */
import { HStack, Image, Text } from '@chakra-ui/react';
import { CustomSkeleton } from '@components/custom-skeleton/custom-skeleton';
import { useEthereumConfiguration } from '@hooks/use-ethereum-configuration';
import { truncateAddress, unshiftValue } from 'dlc-btc-lib/utilities';

export interface MerchantFocusTableItemProps {
  id: number;
  orderBook: string;
  amount: number;
  inUSD: string;
  txHash: string;
  date: string;
}

export function MerchantDetailsTableItem(
  merchantFocusTableItem: MerchantFocusTableItemProps
): React.JSX.Element {
  if (!merchantFocusTableItem) return <CustomSkeleton height={'35px'} />;

  const { orderBook, amount, inUSD, txHash, date } = merchantFocusTableItem;

  const { ethereumExplorerAPIURL } = useEthereumConfiguration();

  const renderAmount = () => {
    if (orderBook === 'REDEEM') {
      return unshiftValue(amount) * -1;
    } else {
      return unshiftValue(amount);
    }
  };

  return (
    <HStack
      p={'10px'}
      w={'100%'}
      h={'50px'}
      bg={orderBook === 'MINT' ? 'table.background.green' : 'table.background.red'}
      blendMode={'screen'}
      border={'1px solid'}
      borderRadius={'md'}
      borderColor={'border.white.01'}
      justifyContent={'space-between'}
    >
      <Text
        w={'20%'}
        color={orderBook === 'MINT' ? 'green.mint' : 'red.redeem'}
        fontSize={'sm'}
        fontWeight={700}
      >
        {orderBook}
      </Text>
      <HStack w={'20%'}>
        <Image src={'/images/logos/dlc-btc-logo.svg'} alt={'dlc BTC logo'} boxSize={'25px'} />
        <Text color={'white'} fontSize={'sm'} fontWeight={800}>
          {renderAmount()}
        </Text>
      </HStack>

      <Text w={'20%'} color={'white'} fontSize={'sm'}>
        {inUSD}
      </Text>
      <Text
        w={'20%'}
        color={'accent.lightBlue.01'}
        fontSize={'sm'}
        onClick={() => window.open(`${ethereumExplorerAPIURL}/tx/${txHash}`, '_blank')}
        cursor={'pointer'}
        textDecoration={'underline'}
      >
        {truncateAddress(txHash)}
      </Text>
      <Text w={'20%'} color={'white'} fontSize={'sm'}>
        {date}
      </Text>
    </HStack>
  );
}
