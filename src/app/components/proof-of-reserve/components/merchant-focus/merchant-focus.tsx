import { useContext } from 'react';

import { Divider, HStack, Text, VStack } from '@chakra-ui/react';
import { GenericTableBody } from '@components/generic-table/components/generic-table-body';
import { GenericTableHeader } from '@components/generic-table/components/generic-table-header';
import { GenericTableHeaderText } from '@components/generic-table/components/generic-table-header-text';
import { GenericTableLayout } from '@components/generic-table/components/generic-table-layout';
import { Merchant } from '@models/merchant';
import { bitcoin, dlcBTC } from '@models/token';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';

import { exampleMerchantFocusTableItems } from '@shared/examples/example-merchant-focus-table-items';

import { MerchantFocusTableItem } from '../merchant-table/components/merchant-focus-table-item';
import { TokenStatsBoardToken } from '../token-stats-board/components/token-stats-board-token';
import { TokenStatsBoardTVL } from '../token-stats-board/components/token-stats-board-tvl';
import { TokenStatsBoardLayout } from '../token-stats-board/token-stats-board.layout';
import { MerchantFocusLayout } from './components/merchant-focus-layout';

export function MerchantFocus(): React.JSX.Element {
  const { proofOfReserve, totalSupply, bitcoinPrice } = useContext(ProofOfReserveContext);

  const [proofOfReserveSum, merchantProofOfReserves] = proofOfReserve || [
    undefined,
    appConfiguration.merchants.map((merchant: Merchant) => {
      return {
        merchant,
        dlcBTCAmount: undefined,
      };
    }),
  ];
  const amberMerchant = merchantProofOfReserves.find(item => item.merchant.name === 'AMBER');

  const renderMerchantFocusTableItems = () => {
    return (
      <>
        {exampleMerchantFocusTableItems.map(item => (
          <MerchantFocusTableItem key={item.id} {...item} />
        ))}
      </>
    );
  };

  return (
    <MerchantFocusLayout>
      <Text w={'100%'} color={'white'} fontSize={'6xl'} fontWeight={500}>
        Amber Group Dashboard
      </Text>
      <TokenStatsBoardLayout width="50%">
        <VStack w={'100%'} alignItems={'flex-start'}>
          <TokenStatsBoardTVL
            totalSupply={amberMerchant?.dlcBTCAmount}
            bitcoinPrice={bitcoinPrice}
          />
          <HStack w={'100%'} pl={'25px'}>
            <TokenStatsBoardToken token={dlcBTC} totalSupply={amberMerchant?.dlcBTCAmount} />
            <Divider orientation={'vertical'} px={'15px'} height={'75px'} variant={'thick'} />
            <TokenStatsBoardToken token={bitcoin} totalSupply={proofOfReserveSum} />
          </HStack>
        </VStack>
      </TokenStatsBoardLayout>
      <GenericTableLayout height={'300px'}>
        <GenericTableHeader
          children={
            <>
              <GenericTableHeaderText>Order Book</GenericTableHeaderText>
              <GenericTableHeaderText>Amount</GenericTableHeaderText>
              <GenericTableHeaderText>in USD</GenericTableHeaderText>
              <GenericTableHeaderText>TX Number</GenericTableHeaderText>
              <GenericTableHeaderText>Date</GenericTableHeaderText>
            </>
          }
        />
        <GenericTableBody renderItems={renderMerchantFocusTableItems} />
      </GenericTableLayout>
    </MerchantFocusLayout>
  );
}
