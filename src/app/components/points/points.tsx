import { useContext } from 'react';

import { Divider, HStack, Text } from '@chakra-ui/react';
import { TokenStatsBoardLayout } from '@components/proof-of-reserve/components/token-stats-board/token-stats-board.layout';
import { bitcoin, dlcBTC } from '@models/token';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';

import { PointsLayout } from './components/points-layout';
import { PointsStatsBoardAction } from './components/points-stats-board-action';

export function Points(): React.JSX.Element {
  const { proofOfReserve, totalSupply } = useContext(ProofOfReserveContext);

  return (
    <PointsLayout>
      <Text w={'100%'} color={'white'} fontSize={'6xl'} fontWeight={500}>
        Use dlcBTC <br></br>
        <Text as="span" fontWeight={700}>
          Earn Points
        </Text>
      </Text>

      <TokenStatsBoardLayout height={'354px'}>
        <Text color={'white'} fontSize={'28px'}>
          You've Earned
        </Text>
        <Text
          fontSize={'48px'}
          bgGradient={`linear(to-r, #AC50EF, #7059FB, #2ECFF6)`}
          bgClip="text"
        >
          0 Points
        </Text>
        <Divider h={'1px'} w={'464px'} orientation={'horizontal'} variant={'thick'} />
        <HStack w={'50%'} pl={'25px'}>
          <PointsStatsBoardAction token={dlcBTC} totalSupply={totalSupply} />
          <Divider orientation={'vertical'} px={'15px'} variant={'thick'} />
          <PointsStatsBoardAction token={bitcoin} totalSupply={proofOfReserve} />
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
