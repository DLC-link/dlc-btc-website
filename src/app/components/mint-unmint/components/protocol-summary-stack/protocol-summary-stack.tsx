// import { ProtocolHistory } from "@components/protocol-history/protocol-history";
import { Skeleton, Text, VStack } from '@chakra-ui/react';
import { useBitcoinPrice } from '@hooks/use-bitcoin-price';
import { useEthereum } from '@hooks/use-ethereum';

import { ProtocolSummaryStackLayout } from './components/protocol-summary-stack.layout';

export function ProtocolSummaryStack(): React.JSX.Element {
  const { totalSupply } = useEthereum();
  const { bitcoinPrice } = useBitcoinPrice();

  return (
    <ProtocolSummaryStackLayout>
      <VStack alignItems={'start'}>
        <Text alignContent={'start'} color={'white'} fontSize={'lg'}>
          TVL
        </Text>
        <VStack alignItems={'start'} w={'100%'} spacing={'0px'}>
          <Skeleton isLoaded={totalSupply !== undefined} w={'100%'}>
            <Text alignContent={'start'} color={'white'} fontSize={'3xl'} fontWeight={'semibold'}>
              {totalSupply} dlcBTC
            </Text>
          </Skeleton>
          <Skeleton isLoaded={totalSupply !== undefined} w={'100%'}>
            <Text alignContent={'start'} color={'white'} fontSize={'lg'}>
              ${totalSupply && bitcoinPrice ? (totalSupply * bitcoinPrice).toLocaleString() : 0}
            </Text>
          </Skeleton>
        </VStack>
      </VStack>
    </ProtocolSummaryStackLayout>
  );
}
