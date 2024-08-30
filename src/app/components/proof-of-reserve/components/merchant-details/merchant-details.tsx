import { useContext } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import { Divider, HStack, Icon, Image, Link, Text } from '@chakra-ui/react';
import { fetchMintBurnEvents } from '@functions/ethereum.functions';
import { Merchant } from '@models/merchant';
import { bitcoin, dlcBTC } from '@models/token';
import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';
import { useQuery } from '@tanstack/react-query';
import { DetailedEvent } from 'dlc-btc-lib/models';
import { isEmpty } from 'ramda';

import { MerchantDetailsTableItemProps } from '../merchant-table/components/merchant-details-table-item';
import { MerchantDetailsTable } from '../merchant-table/merchant-details-table';
import { TokenStatsBoardToken } from '../token-stats-board/components/token-stats-board-token';
import { TokenStatsBoardTVL } from '../token-stats-board/components/token-stats-board-tvl';
import { TokenStatsBoardLayout } from '../token-stats-board/token-stats-board.layout';
import { MerchantDetailsLayout } from './components/merchant-details-layout';

export function MerchantDetails(): React.JSX.Element {
  const { name } = useParams();
  const { proofOfReserve, bitcoinPrice } = useContext(ProofOfReserveContext);
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

  const { ethereumNetworkConfiguration } = useContext(EthereumNetworkConfigurationContext);

  const { data: mintBurnEvents } = useQuery({
    queryKey: [`mintBurnEvents${name}`, ethereumNetworkConfiguration.dlcBTCContract.address],
    queryFn: fetchMintBurnEventsHandler,
  });

  if (!name) return <Text>Error: No merchant name provided</Text>;

  async function fetchMintBurnEventsHandler(): Promise<MerchantDetailsTableItemProps[]> {
    if (!selectedMerchant || isEmpty(selectedMerchant?.merchant.addresses)) return [];
    const detailedEvents: DetailedEvent[] = (
      await Promise.all(
        selectedMerchant.merchant.addresses.map(async address => {
          return await fetchMintBurnEvents(
            ethereumNetworkConfiguration.dlcBTCContract,
            ethereumNetworkConfiguration.chain.rpcUrls.default.http[0],
            address
          );
        })
      )
    ).flat();

    return detailedEvents.map((event, index) => {
      return {
        id: index,
        orderBook: selectedMerchant.merchant.addresses
          .map(address => address.toLowerCase())
          .includes(event.from.toLowerCase())
          ? 'REDEEM'
          : 'MINT',
        amount: event.value,
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
        {`${name}`}
        <br />
        {'Dashboard'}
      </Text>
      <Link
        color="accent.lightBlue.01"
        fontSize="lg"
        fontWeight="regular"
        textDecoration="underline"
        onClick={() => navigate('/proof-of-reserve')}
      >
        <HStack spacing={2} alignItems="center">
          <Icon as={MdArrowBack} />
          <Text>Back to the List</Text>
        </HStack>
      </Link>

      <TokenStatsBoardLayout width={'100%'}>
        <HStack w={'100%'} alignItems={'center'} justifyContent={'space-evenly'}>
          <Image
            src={selectedMerchant?.merchant.logo}
            alt={'Merchant logo'}
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
