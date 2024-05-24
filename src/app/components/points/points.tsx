import { Text } from '@chakra-ui/react';
import { TokenStatsBoardLayout } from '@components/proof-of-reserve/components/token-stats-board/token-stats-board.layout';

import { PointsLayout } from './components/points-layout';

export function Points(): React.JSX.Element {
  //const { bitcoinPrice } = useBitcoinPrice();

  //const { proofOfReserve, totalSupply } = useContext(ProofOfReserveContext);

  return (
    <PointsLayout>
      <Text w={'100%'} color={'white'} fontSize={'6xl'} fontWeight={500}>
        Use dlcBTC <br></br>
        <Text as="span" fontWeight={700}>
          Earn Points
        </Text>
      </Text>

      <TokenStatsBoardLayout>
        <Text color={'white'}>You've Earned</Text>
        {/* <TokenStatsBoardTVL totalSupply={totalSupply} bitcoinPrice={bitcoinPrice} />
        <HStack w={'50%'} pl={'25px'}>
          <TokenStatsBoardToken token={dlcBTC} totalSupply={totalSupply} />
          <Divider orientation={'vertical'} px={'15px'} variant={'thick'} />
          <TokenStatsBoardToken token={bitcoin} totalSupply={proofOfReserve} />
        </HStack> */}
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
    </PointsLayout>
  );
}
