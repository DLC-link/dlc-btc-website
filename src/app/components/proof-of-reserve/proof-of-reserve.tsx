import { useContext } from 'react';
import { useQuery } from 'react-query';

import { Divider, HStack, Skeleton, Text } from '@chakra-ui/react';
import { GenericTableBody } from '@components/generic-table/components/generic-table-body';
import { GenericTableHeader } from '@components/generic-table/components/generic-table-header';
import { GenericTableHeaderText } from '@components/generic-table/components/generic-table-header-text';
import { GenericTableLayout } from '@components/generic-table/components/generic-table-layout';
import {
  ProtocolHistoryTableItem,
  ProtocolHistoryTableItemProps,
} from '@components/protocol-history-table/components/protocol-history-table-item';
import { useEthereum } from '@hooks/use-ethereum';
import { Merchant } from '@models/merchant';
import { bitcoin, dlcBTC } from '@models/token';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';

import { BURN_ADDRESS } from '@shared/constants/ethereum.constants';

import { MerchantTableHeader } from './components/merchant-table/components/merchant-table-header';
import { MerchantTableItem } from './components/merchant-table/components/merchant-table-item';
import { MerchantTableLayout } from './components/merchant-table/merchant-table-layout';
import { ProofOfReserveLayout } from './components/proof-of-reserve-layout';
import { TokenStatsBoardToken } from './components/token-stats-board/components/token-stats-board-token';
import { TokenStatsBoardTVL } from './components/token-stats-board/components/token-stats-board-tvl';
import { TokenStatsBoardLayout } from './components/token-stats-board/token-stats-board.layout';

export function ProofOfReserve(): React.JSX.Element {
  const { proofOfReserve, totalSupply, bitcoinPrice } = useContext(ProofOfReserveContext);
  const { fetchAllMintBurnEvents } = useEthereum();

  const [proofOfReserveSum, merchantProofOfReserves] = proofOfReserve || [
    undefined,
    appConfiguration.merchants.map((merchant: Merchant) => {
      return {
        merchant,
        dlcBTCAmount: undefined,
      };
    }),
  ];

  const { data: allMintBurnEvents } = useQuery(
    ['allMintBurnEvents'],
    fetchAllMintBurnEventsHandler
  );

  async function fetchAllMintBurnEventsHandler(): Promise<ProtocolHistoryTableItemProps[]> {
    const detailedEvents = await fetchAllMintBurnEvents();
    return detailedEvents.map((event, index) => {
      const isMint = event.from.toLowerCase() === BURN_ADDRESS.toLowerCase();
      // const knownMerchant = appConfiguration.merchants.find(
      //   merchant => merchant.address === (isMint ? event.to : event.from)
      // );
      // console.log('knownMerchant', knownMerchant);
      return {
        id: index,
        dlcBTCAmount: isMint ? event.value.toNumber() : event.value.toNumber() * -1,
        // merchant: knownMerchant ? knownMerchant.name : isMint ? event.to : event.from,
        merchant: isMint ? event.to : event.from,
        txHash: event.txHash,
        date: new Date(event.timestamp * 1000).toDateString(),
      };
    });
  }

  const renderProtocolHistoryTableItems = () => {
    return (
      <>{allMintBurnEvents?.map(item => <ProtocolHistoryTableItem key={item.id} {...item} />)}</>
    );
  };

  return (
    <ProofOfReserveLayout>
      <Text w={'100%'} color={'white'} fontSize={'6xl'} fontWeight={500}>
        Proof of Reserve
      </Text>
      <TokenStatsBoardLayout>
        <HStack w={'100%'}>
          <TokenStatsBoardTVL totalSupply={totalSupply} bitcoinPrice={bitcoinPrice} />
          <Divider orientation={'vertical'} px={'15px'} height={'75px'} variant={'thick'} />
          <TokenStatsBoardToken token={dlcBTC} totalSupply={totalSupply} />
          <Divider orientation={'vertical'} px={'15px'} height={'75px'} variant={'thick'} />
          <TokenStatsBoardToken token={bitcoin} totalSupply={proofOfReserveSum} />
        </HStack>
      </TokenStatsBoardLayout>
      <HStack w={'100%'} gap={'20px'} alignItems={'flex-start'} px={'20px'}>
        <MerchantTableLayout>
          <MerchantTableHeader />
          {merchantProofOfReserves.map(item => (
            <MerchantTableItem key={item.merchant.name} {...item} />
          ))}
        </MerchantTableLayout>
        <GenericTableLayout height={'630px'} width={'50%'}>
          <GenericTableHeader>
            <GenericTableHeaderText w={'25%'}>Order Book</GenericTableHeaderText>
            <GenericTableHeaderText w={'21%'}>Merchant</GenericTableHeaderText>
            <GenericTableHeaderText w={'25%'}>Transaction</GenericTableHeaderText>
            <GenericTableHeaderText>Date</GenericTableHeaderText>
          </GenericTableHeader>
          <Skeleton isLoaded={allMintBurnEvents !== undefined} height={'50px'} w={'100%'}>
            <GenericTableBody renderItems={renderProtocolHistoryTableItems} />
          </Skeleton>
        </GenericTableLayout>
      </HStack>
    </ProofOfReserveLayout>
  );
}
