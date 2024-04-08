import { useContext } from 'react';

import { Divider, HStack, Text } from '@chakra-ui/react';
import { useBitcoinPrice } from '@hooks/use-bitcoin-price';
import { bitcoin, dlcBTC } from '@models/token';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';

import { ProofOfReserveLayout } from './components/proof-of-reserve-layout';
import { TokenStatsBoardToken } from './components/token-stats-board/components/token-stats-board-token';
import { TokenStatsBoardTVL } from './components/token-stats-board/components/token-stats-board-tvl';
import { TokenStatsBoardLayout } from './components/token-stats-board/token-stats-board.layout';

export function ProofOfReserve(): React.JSX.Element {
  const { bitcoinPrice } = useBitcoinPrice();

  const { proofOfReserve, totalSupply } = useContext(ProofOfReserveContext);

  return (
    <ProofOfReserveLayout>
      <Text w={'100%'} px={'35px'} color={'white'} fontSize={'4xl'} fontWeight={600}>
        Proof of Reserve
      </Text>
      <TokenStatsBoardLayout>
        <TokenStatsBoardTVL totalSupply={totalSupply} bitcoinPrice={bitcoinPrice} />
        <HStack w={'50%'} pl={'25px'}>
          <TokenStatsBoardToken token={dlcBTC} totalSupply={totalSupply} />
          <Divider orientation={'vertical'} px={'15px'} variant={'thick'} />
          <TokenStatsBoardToken token={bitcoin} totalSupply={proofOfReserve} />
        </HStack>
      </TokenStatsBoardLayout>
      {/* <HStack w={'100%'} spacing={'20px'}>
        <MerchantTableLayout>
          <MerchantTableHeader />
          {exampleMerchantTableItems.map(item => (
            <MerchantTableItem key={item.merchant.name} {...item} />
          ))}
        </MerchantTableLayout>
        <ProtocolHistoryTable />
      </HStack> */}
    </ProofOfReserveLayout>
  );
}
