import { useContext } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import { Divider, HStack, Icon, Image, Link, Text } from '@chakra-ui/react';
import { bitcoin, dlcBTC } from '@models/token';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';

import { MerchantDetailsTable } from '../merchant-table/merchant-details-table';
import { TokenStatsBoardToken } from '../token-stats-board/components/token-stats-board-token';
import { TokenStatsBoardTVL } from '../token-stats-board/components/token-stats-board-tvl';
import { TokenStatsBoardLayout } from '../token-stats-board/token-stats-board.layout';
import { MerchantDetailsLayout } from './components/merchant-details-layout';

export function MerchantDetails(): React.JSX.Element {
  const { name } = useParams();
  const { proofOfReserve, bitcoinPrice, merchantMintBurnEvents } =
    useContext(ProofOfReserveContext);
  const navigate = useNavigate();

  const selectedMerchant = proofOfReserve?.[1].find(item => item.merchant.name === name);
  const mintBurnEvents = merchantMintBurnEvents?.find(item => item.name === name)?.mintBurnEvents;

  if (!name) return <Text>Error: No merchant name provided</Text>;

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
