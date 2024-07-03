import { useContext } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { Divider, HStack, Image, Text } from '@chakra-ui/react';
import { GenericTableBody } from '@components/generic-table/components/generic-table-body';
import { GenericTableHeader } from '@components/generic-table/components/generic-table-header';
import { GenericTableHeaderText } from '@components/generic-table/components/generic-table-header-text';
import { GenericTableLayout } from '@components/generic-table/components/generic-table-layout';
import { useEthereum } from '@hooks/use-ethereum';
import { Merchant } from '@models/merchant';
import { bitcoin, dlcBTC } from '@models/token';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';

import {
  MerchantDetailsTableItem,
  MerchantFocusTableItemProps,
} from '../merchant-table/components/merchant-details-table-item';
import { TokenStatsBoardToken } from '../token-stats-board/components/token-stats-board-token';
import { TokenStatsBoardTVL } from '../token-stats-board/components/token-stats-board-tvl';
import { TokenStatsBoardLayout } from '../token-stats-board/token-stats-board.layout';
import { MerchantDetailsLayout } from './components/merchant-details-layout';

export function MerchantDetails(): React.JSX.Element {
  const { name } = useParams();
  const { proofOfReserve, bitcoinPrice } = useContext(ProofOfReserveContext);
  const { fetchMintBurnEvents } = useEthereum();

  const [proofOfReserveSum, merchantProofOfReserves] = proofOfReserve || [
    undefined,
    appConfiguration.merchants.map((merchant: Merchant) => {
      return {
        merchant,
        dlcBTCAmount: undefined,
      };
    }),
  ];
  const amberMerchant = merchantProofOfReserves.find(item => item.merchant.name === 'AMBER');

  const { data: mintBurnEvents } = useQuery(['mintBurnEvents'], fetchMintBurnEventsHandler);

  async function fetchMintBurnEventsHandler(): Promise<MerchantFocusTableItemProps[]> {
    if (!amberMerchant?.merchant.address) return [];
    const detailedEvents = await fetchMintBurnEvents(amberMerchant.merchant.address);
    return detailedEvents.map((event, index) => {
      return {
        id: index,
        orderBook:
          event.from.toLowerCase() === amberMerchant.merchant.address.toLowerCase()
            ? 'REDEEM'
            : 'MINT',
        amount: event.value.toString(),
        inUSD: 'TODO', //TODO: calculate usd value at the time of mint
        txHash: event.txHash,
        date: new Date(event.timestamp * 1000).toDateString(),
      };
    });
  }

  const renderMerchantFocusTableItems = () => {
    return <>{mintBurnEvents?.map(item => <MerchantDetailsTableItem key={item.id} {...item} />)}</>;
  };

  return (
    <MerchantDetailsLayout>
      <Text w={'100%'} color={'white'} fontSize={'6xl'} fontWeight={500}>
        {name} Group Dashboard
      </Text>
      <TokenStatsBoardLayout width="100%">
        <HStack w={'100%'} alignItems={'center'}>
          <Image src={'public/images/logos/amber-logo.svg'} alt={'amber logo'} boxSize={'100px'} />
          <Divider orientation={'vertical'} px={'15px'} height={'75px'} variant={'thick'} />
          <TokenStatsBoardTVL
            totalSupply={amberMerchant?.dlcBTCAmount}
            bitcoinPrice={bitcoinPrice}
          />
          <Divider orientation={'vertical'} px={'15px'} height={'75px'} variant={'thick'} />
          <TokenStatsBoardToken token={dlcBTC} totalSupply={amberMerchant?.dlcBTCAmount} />
          <Divider orientation={'vertical'} px={'15px'} height={'75px'} variant={'thick'} />
          <TokenStatsBoardToken token={bitcoin} totalSupply={proofOfReserveSum} />
        </HStack>
      </TokenStatsBoardLayout>
      <GenericTableLayout height={'300px'}>
        <GenericTableHeader>
          <GenericTableHeaderText>Order Book</GenericTableHeaderText>
          <GenericTableHeaderText>Amount</GenericTableHeaderText>
          <GenericTableHeaderText>in USD</GenericTableHeaderText>
          <GenericTableHeaderText>Transaction</GenericTableHeaderText>
          <GenericTableHeaderText>Date</GenericTableHeaderText>
        </GenericTableHeader>

        <GenericTableBody renderItems={renderMerchantFocusTableItems} />
      </GenericTableLayout>
    </MerchantDetailsLayout>
  );
}
