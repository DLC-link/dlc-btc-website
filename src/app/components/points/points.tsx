import { Divider, HStack, Text } from '@chakra-ui/react';
import { TokenStatsBoardLayout } from '@components/proof-of-reserve/components/token-stats-board/token-stats-board.layout';
import { usePoints } from '@hooks/use-points';
import { bitcoin, dlcBTC } from '@models/token';

import { TokenStatsBoardTotalPoints } from './components/point-stats-board-total-points';
import { PointsLayout } from './components/points-layout';
import { PointsStatsBoardAction } from './components/points-stats-board-action';

export function Points(): React.JSX.Element {
  const { userPoints } = usePoints();

  return (
    <PointsLayout>
      <Text w={'100%'} color={'white'} fontSize={'6xl'} fontWeight={500}>
        Use dlcBTC <br></br>
        <Text as="span" fontWeight={700}>
          Earn Points
        </Text>
      </Text>
      <TokenStatsBoardLayout>
        <TokenStatsBoardTotalPoints totalPoints={userPoints} />
        <HStack w={'50%'} pl={'25px'}>
          <PointsStatsBoardAction token={dlcBTC} totalSupply={0} />
          <Divider orientation={'vertical'} px={'15px'} height={'150px'} variant={'thick'} />
          <PointsStatsBoardAction token={bitcoin} totalSupply={userPoints} />
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
    </PointsLayout>
  );
}
