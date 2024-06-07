import { useContext } from 'react';

import { Divider, HStack, Text } from '@chakra-ui/react';
import { useBitcoinPrice } from '@hooks/use-bitcoin-price';
import { amber } from '@models/merchant';
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

  const { proofOfReserve, totalSupply } = useContext(ProofOfReserveContext);

  return (
    <ProofOfReserveLayout>
      <Text w={'100%'} color={'white'} fontSize={'6xl'} fontWeight={500}>
        Proof of Reserve
      </Text>
      <TokenStatsBoardLayout>
        <TokenStatsBoardTVL totalSupply={totalSupply} bitcoinPrice={bitcoinPrice} />
        <HStack w={'50%'} pl={'25px'}>
          <TokenStatsBoardToken token={dlcBTC} totalSupply={totalSupply} />
          <Divider orientation={'vertical'} px={'15px'} height={'75px'} variant={'thick'} />
          <TokenStatsBoardToken token={bitcoin} totalSupply={proofOfReserve} />
        </HStack>
      </TokenStatsBoardLayout>
      <HStack w={'100%'} spacing={'20px'}>
        <MerchantTableLayout>
          <MerchantTableHeader />
          {[{ merchant: amber, dlcBTCAmount: 0.5 }].map(item => (
            <MerchantTableItem key={item.merchant.name} {...item} />
          ))}
        </MerchantTableLayout>
        {/* <ProtocolHistoryTable /> */}
      </HStack>
    </ProofOfReserveLayout>
  );
}
