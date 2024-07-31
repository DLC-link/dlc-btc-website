import { useContext } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { Divider, HStack, Text } from '@chakra-ui/react';
import { ProtocolHistoryTableItemProps } from '@components/protocol-history-table/components/protocol-history-table-item';
import { ProtocolHistoryTable } from '@components/protocol-history-table/protocol-history-table';
import { fetchMintBurnEvents } from '@functions/ethereum.functions';
import { Merchant } from '@models/merchant';
import { bitcoin, dlcBTC } from '@models/token';
import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';
import { RootState } from '@store/index';

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

  const [proofOfReserveSum, merchantProofOfReserves] = proofOfReserve || [
    undefined,
    appConfiguration.merchants.map((merchant: Merchant) => {
      return {
        merchant,
        dlcBTCAmount: undefined,
      };
    }),
  ];

  const { network: ethereumNetwork } = useSelector((state: RootState) => state.account);

  const { data: allMintBurnEvents } = useQuery(['allMintBurnEvents'], fetchMintBurnEventsHandler);

  const { getReadOnlyDLCBTCContract } = useContext(EthereumNetworkConfigurationContext);

  async function fetchMintBurnEventsHandler(): Promise<ProtocolHistoryTableItemProps[]> {
    const detailedEvents = await fetchMintBurnEvents(
      getReadOnlyDLCBTCContract(),
      ethereumNetwork.defaultNodeURL,
      undefined,
      10
    );
    return detailedEvents.map((event, index) => {
      const isMint = event.from.toLowerCase() === BURN_ADDRESS.toLowerCase();
      return {
        id: index,
        dlcBTCAmount: isMint ? event.value : event.value * -1,
        merchant: isMint ? event.to : event.from,
        txHash: event.txHash,
        date: new Date(event.timestamp * 1000).toDateString(),
      };
    });
  }

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
      <HStack w={'100%'} gap={'20px'} alignItems={'flex-start'}>
        <MerchantTableLayout>
          <MerchantTableHeader />
          {merchantProofOfReserves.map(item => (
            <MerchantTableItem key={item.merchant.name} {...item} />
          ))}
        </MerchantTableLayout>
        <ProtocolHistoryTable items={allMintBurnEvents} />
      </HStack>
    </ProofOfReserveLayout>
  );
}
