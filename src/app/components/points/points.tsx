import { useDispatch, useSelector } from 'react-redux';

import { Button, Divider, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { TokenStatsBoardLayout } from '@components/proof-of-reserve/components/token-stats-board/token-stats-board.layout';
import { usePoints } from '@hooks/use-points';
import { bitcoin, dlcBTC } from '@models/token';
import { RootState } from '@store/index';
import { modalActions } from '@store/slices/modal/modal.actions';

import { TokenStatsBoardTotalPoints } from './components/point-stats-board-total-points';
import { PointsLayout } from './components/points-layout';
import { PointsStatsBoardAction } from './components/points-stats-board-action';

export function Points(): React.JSX.Element {
  const dispatch = useDispatch();
  const { userPoints } = usePoints();
  const { address } = useSelector((state: RootState) => state.account);

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
            <HStack w={'100%'}>
              <VStack w={'50%'} alignItems={'flex-start'}>
                <TokenStatsBoardTotalPoints totalPoints={userPoints} />
                <HStack w={'100%'} pl={'25px'}>
                  <PointsStatsBoardAction token={dlcBTC} totalSupply={0} />
                  <Divider
                    orientation={'vertical'}
                    px={'15px'}
                    height={'125px'}
                    variant={'thick'}
                  />
                  <PointsStatsBoardAction token={bitcoin} totalSupply={userPoints} />
                </HStack>
              </VStack>
              <VStack w={'50%'} alignItems={'flex-start'} spacing={'65px'} px={'25px'}>
                <VStack w={'100%'} alignItems={'start'} spacing={'25px'}>
                  <Text
                    textAlign={'left'}
                    bgGradient={`linear(to-r, #AC50EF, #7059FB, #2ECFF6)`}
                    bgClip="text"
                  >
                    Earn points by using dlcBTC
                  </Text>
                  <Text color={'white.02'}>
                    Put your dlcBTC to work in various activities like lending, staking, or trading.
                    Participate and earn points for your involvement.
                  </Text>
                </VStack>
                <VStack w={'100%'} alignItems={'start'} spacing={'25px'}>
                  <Text
                    textAlign={'left'}
                    bgGradient={`linear(to-r, #AC50EF, #7059FB, #2ECFF6)`}
                    bgClip="text"
                  >
                    Earn points by providing Bitcoin
                  </Text>
                  <Text color={'white.02'}>
                    Become a merchany by providing BTC. Support the network and earn points for your
                    contributions.
                  </Text>
                </VStack>
              </VStack>
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
                      Become a merchany by providing BTC. Support the network and earn points for
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
