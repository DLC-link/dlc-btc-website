/* eslint-disable */
import { useContext } from 'react';

import { HStack, Image, Text } from '@chakra-ui/react';
import { CustomSkeleton } from '@components/custom-skeleton/custom-skeleton';
import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { truncateAddress, unshiftValue } from 'dlc-btc-lib/utilities';

export interface MerchantDetailsTableItemProps {
  id: number;
  orderBook: string;
  amount: number;
  inUSD: string;
  txHash: string;
  date: string;
}

export function MerchantDetailsTableItem(
  merchantFocusTableItem: MerchantDetailsTableItemProps
): React.JSX.Element {
  if (!merchantFocusTableItem) return <CustomSkeleton height={'35px'} />;

  const { orderBook, amount, txHash, date } = merchantFocusTableItem;

  const { ethereumExplorerAPIURL } = useContext(EthereumNetworkConfigurationContext);

  const renderAmount = () => {
    const unshiftedValue = unshiftValue(amount);
    return orderBook === 'REDEEM' ? -unshiftedValue : unshiftedValue;
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
        w={'18%'}
        color={orderBook === 'MINT' ? 'green.mint' : 'red.redeem'}
        fontSize={'sm'}
        fontWeight={700}
      >
        {orderBook}
      </Text>
      <HStack w={'18%'}>
        <Image src={'/images/logos/dlc-btc-logo.svg'} alt={'dlc BTC logo'} boxSize={'25px'} />
        <Text color={'white'} fontSize={'sm'} fontWeight={800}>
          {renderAmount()}
        </Text>
      </HStack>
      {/* add back the USD calculation later and adjus the width accordingly */}
      {/* <Text w={'20%'} color={'white'} fontSize={'sm'}>
        {inUSD}
      </Text> */}
      <Text
        w={'15%'}
        color={'accent.lightBlue.01'}
        fontSize={'sm'}
        onClick={() => window.open(`${ethereumExplorerAPIURL}/tx/${txHash}`, '_blank')}
        cursor={'pointer'}
        textDecoration={'underline'}
      >
        {truncateAddress(txHash)}
      </Text>
      <Text w={'25%'} color={'white'} fontSize={'sm'}>
        {date}
      </Text>
    </HStack>
  );
}
