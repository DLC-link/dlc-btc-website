import { Divider, HStack } from '@chakra-ui/react';
import { ProtocolHistoryTable } from '@components/protocol-history-table/protocol-history-table';
import { useBitcoinPrice } from '@hooks/use-bitcoin-price';
import { useEthereum } from '@hooks/use-ethereum';
import { bitcoin, dlcBTC } from '@models/token';

import { exampleMerchantTableItems } from '@shared/examples/example-merchant-table-items';

import { MerchantTableHeader } from './components/merchant-table/components/merchant-table-header';
import { MerchantTableItem } from './components/merchant-table/components/merchant-table-item';
import { MerchantTableLayout } from './components/merchant-table/merchant-table-layout';
import { ProofOfReserveLayout } from './components/proof-of-reserve-layout';
import { TokenStatsBoardToken } from './components/token-stats-board/components/token-stats-board-token';
import { TokenStatsBoardTVL } from './components/token-stats-board/components/token-stats-board-tvl';
import { TokenStatsBoardLayout } from './components/token-stats-board/token-stats-board.layout';

export function ProofOfReserve(): React.JSX.Element {
  const { totalSupply } = useEthereum();
  const { bitcoinPrice } = useBitcoinPrice();

  return (
    <ProofOfReserveLayout>
      <TokenStatsBoardLayout>
        <TokenStatsBoardTVL totalSupply={totalSupply} bitcoinPrice={bitcoinPrice} />
        <HStack w={'50%'} pl={'25px'}>
          <TokenStatsBoardToken token={dlcBTC} totalSupply={totalSupply} />
          <Divider orientation={'vertical'} px={'15px'} variant={'thick'} />
          <TokenStatsBoardToken token={bitcoin} totalSupply={totalSupply} />
        </HStack>
      </TokenStatsBoardLayout>
      <HStack w={'100%'} spacing={'20px'}>
        <MerchantTableLayout>
          <MerchantTableHeader />
          {exampleMerchantTableItems.map(item => (
            <MerchantTableItem key={item.merchant.name} {...item} />
          ))}
        </MerchantTableLayout>
        <ProtocolHistoryTable />
      </HStack>
    </ProofOfReserveLayout>
  );
}
