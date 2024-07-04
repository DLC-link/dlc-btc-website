import { useContext } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { Divider, HStack, Icon, Image, Skeleton, Text } from '@chakra-ui/react';
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
  const navigate = useNavigate();

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

  const itemHeight = 65;
  const padding = 20;
  const dynamicHeight = mintBurnEvents ? mintBurnEvents.length * itemHeight + padding : padding;

  const renderMerchantFocusTableItems = () => {
    return <>{mintBurnEvents?.map(item => <MerchantDetailsTableItem key={item.id} {...item} />)}</>;
  };

  const formatName = (name: any) => {
    return name
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <MerchantDetailsLayout>
      <Text
        w={'100%'}
        color={'white'}
        fontSize={'5xl'}
        fontWeight={600}
        pt={'50px'}
        lineHeight={'60px'}
      >
        {`${formatName(name)} Group`}
        <br />
        {'Dashboard'}
      </Text>
      <Text variant={'navigate'} fontSize={'xl'} onClick={() => navigate('/proof-of-reserve')}>
        <HStack spacing={2} alignItems="center">
          <Icon as={MdArrowBack} />
          <Text>Back to the List</Text>
        </HStack>
      </Text>

      <TokenStatsBoardLayout width={'100%'}>
        <HStack w={'100%'} alignItems={'center'} justifyContent={'space-evenly'}>
          <Image
            src={'/images/logos/amber-logo.svg'}
            alt={'amber logo'}
            boxSize={'100px'}
            mx={'30px'}
          />
          <Divider orientation={'vertical'} px={'10px'} height={'75px'} variant={'thick'} />
          <TokenStatsBoardTVL
            totalSupply={amberMerchant?.dlcBTCAmount}
            bitcoinPrice={bitcoinPrice}
          />
          <Divider orientation={'vertical'} px={'10px'} height={'75px'} variant={'thick'} />
          <TokenStatsBoardToken token={dlcBTC} totalSupply={amberMerchant?.dlcBTCAmount} />
          <Divider orientation={'vertical'} px={'10px'} height={'75px'} variant={'thick'} />
          <TokenStatsBoardToken token={bitcoin} totalSupply={amberMerchant?.dlcBTCAmount} />
        </HStack>
      </TokenStatsBoardLayout>
      <GenericTableLayout height={`${dynamicHeight}px`}>
        <GenericTableHeader>
          <GenericTableHeaderText>Order Book</GenericTableHeaderText>
          <GenericTableHeaderText>Amount</GenericTableHeaderText>
          <GenericTableHeaderText>in USD</GenericTableHeaderText>
          <GenericTableHeaderText>Transaction</GenericTableHeaderText>
          <GenericTableHeaderText>Date</GenericTableHeaderText>
        </GenericTableHeader>
        <Skeleton isLoaded={mintBurnEvents !== undefined} height={'50px'} w={'100%'}>
          <GenericTableBody renderItems={renderMerchantFocusTableItems} />
        </Skeleton>
      </GenericTableLayout>
    </MerchantDetailsLayout>
  );
}
