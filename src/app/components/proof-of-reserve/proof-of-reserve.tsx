import { useContext } from 'react';

import { Divider, HStack, Text, VStack } from '@chakra-ui/react';
import { useBitcoinPrice } from '@hooks/use-bitcoin-price';
import { bitcoin, dlcBTC } from '@models/token';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';

import { MerchantTableHeader } from './components/merchant-table/components/merchant-table-header';
import { MerchantTableItem } from './components/merchant-table/components/merchant-table-item';
import { MerchantTableLayout } from './components/merchant-table/merchant-table-layout';
import { ProofOfReserveLayout } from './components/proof-of-reserve-layout';
import { TokenStatsBoardToken } from './components/token-stats-board/components/token-stats-board-token';
import { TokenStatsBoardTVL } from './components/token-stats-board/components/token-stats-board-tvl';
import { TokenStatsBoardLayout } from './components/token-stats-board/token-stats-board.layout';

export function ProofOfReserve(): React.JSX.Element {
  const { bitcoinPrice } = useBitcoinPrice();

  const { proofOfReserve, merchantProofOfReserve, totalSupply } = useContext(ProofOfReserveContext);

  return (
    <ProofOfReserveLayout>
      <Text w={'100%'} color={'white'} fontSize={'6xl'} fontWeight={500}>
        Proof of Reserve
      </Text>
      <TokenStatsBoardLayout>
        <HStack w={'100%'}>
          <VStack w={'50%'} alignItems={'flex-start'}>
            <TokenStatsBoardTVL totalSupply={totalSupply} bitcoinPrice={bitcoinPrice} />
            <HStack w={'100%'} pl={'25px'}>
              <TokenStatsBoardToken token={dlcBTC} totalSupply={totalSupply} />
              <Divider orientation={'vertical'} px={'15px'} height={'75px'} variant={'thick'} />
              <TokenStatsBoardToken token={bitcoin} totalSupply={proofOfReserve} />
            </HStack>
          </VStack>
          <Divider orientation={'vertical'} px={'15px'} height={'275px'} variant={'thick'} />
          <MerchantTableLayout>
            <MerchantTableHeader />
            {merchantProofOfReserve?.map(item => (
              <MerchantTableItem key={item.merchant.name} {...item} />
            ))}
          </MerchantTableLayout>
        </HStack>
        {/* <ProtocolHistoryTable /> */}
      </TokenStatsBoardLayout>
    </ProofOfReserveLayout>
  );
}
