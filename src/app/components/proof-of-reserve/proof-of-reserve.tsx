import { useContext, useEffect, useState } from 'react';

import { Button, Divider, HStack, Text } from '@chakra-ui/react';
import { ProtocolHistoryTable } from '@components/protocol-history-table/protocol-history-table';
import { Merchant } from '@models/merchant';
import { bitcoin, dlcBTC } from '@models/token';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';
import { useAccount } from 'wagmi';

import { MerchantTableHeader } from './components/merchant-table/components/merchant-table-header';
import { MerchantTableItem } from './components/merchant-table/components/merchant-table-item';
import { MerchantTableLayout } from './components/merchant-table/merchant-table-layout';
import { ProofOfReserveLayout } from './components/proof-of-reserve-layout';
import { TokenStatsBoardToken } from './components/token-stats-board/components/token-stats-board-token';
import { TokenStatsBoardTVL } from './components/token-stats-board/components/token-stats-board-tvl';
import { TokenStatsBoardLayout } from './components/token-stats-board/token-stats-board.layout';

export function ProofOfReserve(): React.JSX.Element {
  const { proofOfReserve, totalSupply, bitcoinPrice, allMintBurnEvents } =
    useContext(ProofOfReserveContext);

  const { chain, isConnected } = useAccount();

  const [proofOfReserveSum, merchantProofOfReserves] = proofOfReserve || [
    undefined,
    appConfiguration.merchants.map((merchant: Merchant) => {
      return {
        merchant,
        dlcBTCAmount: undefined,
      };
    }),
  ];

  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    if (isConnected && !chain) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain]);

  return (
    <ProofOfReserveLayout>
      {showBanner && (
        <HStack
          w={'100%'}
          justifyContent={'center'}
          bg={'yellow.300'}
          p={4}
          borderRadius={'md'}
          mb={4}
        >
          <Text fontSize={'lg'} fontWeight={600} color={'black'}>
            Please select a network to continue.
          </Text>
          <Button onClick={() => setShowBanner(false)} colorScheme="red" size="sm">
            Exit
          </Button>
        </HStack>
      )}
      <Text w={'100%'} color={'white'} fontSize={'6xl'} fontWeight={500}>
        Proof of Reserve
      </Text>

      <TokenStatsBoardLayout>
        <HStack w={'100%'}>
          <TokenStatsBoardTVL totalSupply={totalSupply} bitcoinPrice={bitcoinPrice} />
          <Divider orientation={'vertical'} px={'15px'} height={'75px'} variant={'thick'} />
          <TokenStatsBoardToken token={dlcBTC} totalSupply={totalSupply} />
          <Divider orientation={'vertical'} px={'15px'} height={'75px'} variant={'thick'} />
          <TokenStatsBoardToken token={bitcoin} totalSupply={proofOfReserveSum} />
        </HStack>
      </TokenStatsBoardLayout>
      <HStack w={'100%'} gap={'20px'} alignItems={'flex-start'}>
        <MerchantTableLayout>
          <MerchantTableHeader />
          {merchantProofOfReserves.map(item => (
            <MerchantTableItem key={item.merchant.name} {...item} />
          ))}
        </MerchantTableLayout>
        <ProtocolHistoryTable items={allMintBurnEvents} />
      </HStack>
    </ProofOfReserveLayout>
  );
}
