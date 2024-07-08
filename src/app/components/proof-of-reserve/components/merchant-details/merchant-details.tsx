import { useContext } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { Divider, HStack, Icon, Image, Text } from '@chakra-ui/react';
import { useEthereum } from '@hooks/use-ethereum';
import { Merchant } from '@models/merchant';
import { bitcoin, dlcBTC } from '@models/token';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';

import { MerchantDetailsTableItemProps } from '../merchant-table/components/merchant-details-table-item';
import { MerchantDetailsTable } from '../merchant-table/merchant-details-table';
import { TokenStatsBoardToken } from '../token-stats-board/components/token-stats-board-token';
import { TokenStatsBoardTVL } from '../token-stats-board/components/token-stats-board-tvl';
import { TokenStatsBoardLayout } from '../token-stats-board/token-stats-board.layout';
import { MerchantDetailsLayout } from './components/merchant-details-layout';

export function MerchantDetails(): React.JSX.Element {
  const { name } = useParams();
  const { proofOfReserve, bitcoinPrice } = useContext(ProofOfReserveContext);
  const { fetchMintBurnEvents } = useEthereum();
  const navigate = useNavigate();

  const [, merchantProofOfReserves] = proofOfReserve || [
    undefined,
    appConfiguration.merchants.map((merchant: Merchant) => {
      return {
        merchant,
        dlcBTCAmount: undefined,
      };
    }),
  ];
  const selectedMerchant = merchantProofOfReserves.find(item => item.merchant.name === name);

  const { data: mintBurnEvents } = useQuery(['mintBurnEvents'], fetchMintBurnEventsHandler);

  if (!name) return <Text>Error: No merchant name provided</Text>;

  async function fetchMintBurnEventsHandler(): Promise<MerchantDetailsTableItemProps[]> {
    if (!selectedMerchant?.merchant.address) return [];
    const detailedEvents = await fetchMintBurnEvents(selectedMerchant.merchant.address);
    return detailedEvents.map((event, index) => {
      return {
        id: index,
        orderBook:
          event.from.toLowerCase() === selectedMerchant.merchant.address.toLowerCase()
            ? 'REDEEM'
            : 'MINT',
        amount: event.value.toNumber(),
        inUSD: 'TODO', //TODO: calculate usd value at the time of mint
        txHash: event.txHash,
        date: new Date(event.timestamp * 1000).toDateString(),
      };
    });
  }

  return (
    <MerchantDetailsLayout>
      <Text
        w={'100%'}
        color={'white'}
        fontSize={'5xl'}
        fontWeight={600}
        pt={'50px'}
        lineHeight={'60px'}
      >
        {`${name} Group`}
        <br />
        {'Dashboard'}
      </Text>
      <Text variant={'navigate'} fontSize={'xl'} onClick={() => navigate('/proof-of-reserve')}>
        <HStack spacing={2} alignItems="center">
          <Icon as={MdArrowBack} />
          <Text>Back to the List</Text>
        </HStack>
      </Text>

      <TokenStatsBoardLayout width={'100%'}>
        <HStack w={'100%'} alignItems={'center'} justifyContent={'space-evenly'}>
          <Image
            src={selectedMerchant?.merchant.logo}
            alt={'amber logo'}
            boxSize={'100px'}
            mx={'30px'}
          />
          <Divider orientation={'vertical'} px={'10px'} height={'75px'} variant={'thick'} />
          <TokenStatsBoardTVL
            totalSupply={selectedMerchant?.dlcBTCAmount}
            bitcoinPrice={bitcoinPrice}
          />
          <Divider orientation={'vertical'} px={'10px'} height={'75px'} variant={'thick'} />
          <TokenStatsBoardToken token={dlcBTC} totalSupply={selectedMerchant?.dlcBTCAmount} />
          <Divider orientation={'vertical'} px={'10px'} height={'75px'} variant={'thick'} />
          <TokenStatsBoardToken token={bitcoin} totalSupply={selectedMerchant?.dlcBTCAmount} />
        </HStack>
      </TokenStatsBoardLayout>
      <MerchantDetailsTable items={mintBurnEvents} />
    </MerchantDetailsLayout>
  );
}
