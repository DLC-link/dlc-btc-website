import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Button, Divider, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { TokenStatsBoardLayout } from '@components/proof-of-reserve/components/token-stats-board/token-stats-board.layout';
import { usePoints } from '@hooks/use-points';
import { dlcBTC } from '@models/token';
import { modalActions } from '@store/slices/modal/modal.actions';
import { useAccount } from 'wagmi';

import { TokenStatsBoardTotalPoints } from './components/point-stats-board-total-points';
import { PointsLayout } from './components/points-layout';
import { PointsStatsBoardAction } from './components/points-stats-board-action';
import { PointsTable } from './components/points-table/points-table';

export function Points(): React.JSX.Element {
  const dispatch = useDispatch();
  const { userPoints } = usePoints();
  const { address } = useAccount();

  useEffect(() => {
    if (!address) return;
    dispatch(modalActions.toggleJasperModalVisibility());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  function onConnectWalletClick(): void {
    dispatch(modalActions.toggleSelectWalletModalVisibility());
  }

  return (
    <PointsLayout>
      <>
        <Text w={'100%'} color={'white'} fontSize={'6xl'} fontWeight={500}>
          Use dlcBTC -{' '}
          <Text as="span" fontWeight={700}>
            Earn Points
          </Text>
        </Text>
        {!address && (
          <TokenStatsBoardLayout>
            <VStack w={'100%'} h={'100%'} p={'25px'} alignItems={'center'} spacing={'45px'}>
              <Text color={'white.01'} fontSize={'2xl'}>
                Connect your Wallet to view your Points
              </Text>
              <Button
                bgGradient={`linear(to-r, #AC50EF, #7059FB, #2ECFF6)`}
                w={'30%'}
                variant={'points'}
                onClick={() => onConnectWalletClick()}
              >
                <Text color={'white.01'}>Connect Wallet</Text>
              </Button>
            </VStack>
          </TokenStatsBoardLayout>
        )}
        {address && (
          <TokenStatsBoardLayout>
            <HStack w={'100%'} alignItems={'flex-start'}>
              <VStack w={'50%'} alignItems={'flex-start'}>
                <TokenStatsBoardTotalPoints totalPoints={userPoints?.total} />
                <HStack w={'100%'} pl={'25px'}>
                  <PointsStatsBoardAction
                    token={dlcBTC}
                    totalSupply={userPoints?.protocols.find(p => p.name == 'Curve')?.points}
                    tokenSuffix={'Use'}
                  />
                  <Divider
                    orientation={'vertical'}
                    px={'15px'}
                    height={'125px'}
                    variant={'thick'}
                  />
                  <PointsStatsBoardAction
                    token={dlcBTC}
                    totalSupply={userPoints?.protocols.find(p => p.name == 'dlcBTC')?.points}
                    tokenSuffix={'Hold'}
                  />
                </HStack>
              </VStack>
              <Divider orientation={'vertical'} px={'5px'} height={'300px'} variant={'thick'} />
              <PointsTable items={userPoints?.protocols} />
            </HStack>
          </TokenStatsBoardLayout>
        )}
        {!address && (
          <TokenStatsBoardLayout>
            <HStack w={'100%'} p={'25px'}>
              <VStack w={'50%'} h={'100%'} pr={'25px'} alignItems={'start'} spacing={'45px'}>
                <VStack w={'100%'} h={'85px'} alignItems={'start'} spacing={'25px'}>
                  <HStack h={'25px'} spacing={'25px'}>
                    <Image
                      src={'./images/logos/dlc-btc-logo.svg'}
                      alt={'dlcBTC Logo'}
                      boxSize={'35px'}
                    />
                    <Text color={'white'} fontWeight={200} fontSize={'4xl'}>
                      Use dlcBTC
                    </Text>
                  </HStack>
                  <HStack>
                    <Text color={'white.02'}>
                      Put your dlcBTC to work in various activities like lending, staking, or
                      trading Participate and earn points for your involvement.
                    </Text>
                  </HStack>
                </VStack>
                <Button
                  bgGradient={`linear(to-r, #AC50EF, #7059FB, #2ECFF6)`}
                  w={'100%'}
                  variant={'points'}
                  onClick={() => window.open('https://www.dlc.link/earn-with-dlcbtc', '_blank')}
                >
                  <Text color={'white.01'}>Earn Points</Text>
                </Button>
              </VStack>
              <Divider orientation={'vertical'} px={'15px'} height={'185px'} variant={'thick'} />
              <VStack w={'50%'} h={'100%'} pr={'25px'} alignItems={'start'} spacing={'45px'}>
                <VStack w={'100%'} h={'85px'} alignItems={'start'} spacing={'25px'}>
                  <HStack h={'25px'} spacing={'25px'}>
                    <Image
                      src={'./images/logos/bitcoin-logo.svg'}
                      alt={'dlcBTC Logo'}
                      boxSize={'35px'}
                    />
                    <Text color={'white'} fontWeight={200} fontSize={'4xl'}>
                      Provide Bitcoin
                    </Text>
                  </HStack>
                  <HStack>
                    <Text color={'white.02'}>
                      Become a merchant by providing BTC. Support the network and earn points for
                      your contributions.
                    </Text>
                  </HStack>
                </VStack>
                <Button
                  w={'100%'}
                  variant={'points'}
                  onClick={() => window.open('https://www.dlc.link/merchants', '_blank')}
                >
                  <Text bgGradient={`linear(to-r, #AC50EF, #7059FB, #2ECFF6)`} bgClip="text">
                    Become a Merchant
                  </Text>
                </Button>
              </VStack>
            </HStack>
          </TokenStatsBoardLayout>
        )}

        {/* <HStack w={'100%'} spacing={'20px'}>
        <MerchantTableLayout>
          <MerchantTableHeader />
          {exampleMerchantTableItems.map(item => (
            <MerchantTableItem key={item.merchant.name} {...item} />
          ))}
        </MerchantTableLayout>
        <ProtocolHistoryTable />
      </HStack> */}
      </>
    </PointsLayout>
  );
}
