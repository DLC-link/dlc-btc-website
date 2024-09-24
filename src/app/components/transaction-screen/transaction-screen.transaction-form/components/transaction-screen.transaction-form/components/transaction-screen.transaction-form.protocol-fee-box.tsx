import { useEffect } from 'react';

import { HStack, Text, VStack } from '@chakra-ui/react';
import Decimal from 'decimal.js';
import { getFeeAmount } from 'dlc-btc-lib/bitcoin-functions';

interface TransactionFormProtocolFeeStackProps {
  formType: 'mint' | 'burn';
  assetAmount?: number;
  bitcoinPrice?: number;
  protocolFeeBasisPoints?: number;
  isBitcoinWalletLoading: [boolean, string];
}

function calculateProtocolFeeInUSD(
  assetAmount: number,
  usdPrice: number,
  feeBasisPoints: number
): string {
  const feeAmount = new Decimal(getFeeAmount(assetAmount, feeBasisPoints));
  const result = feeAmount.mul(new Decimal(usdPrice));

  return result.toNumber().toLocaleString('en-US');
}

export function TransactionFormProtocolFeeStack({
  formType,
  assetAmount,
  bitcoinPrice,
  protocolFeeBasisPoints,
  isBitcoinWalletLoading,
}: TransactionFormProtocolFeeStackProps): React.JSX.Element | false {
  useEffect(() => {
    console.log('assetAmount:', assetAmount);
  }, [assetAmount]);
  if (isBitcoinWalletLoading[0] || formType === 'burn') return false;
  return (
    <VStack
      alignItems={'end'}
      p={'15px'}
      w={'100%'}
      border={'1px dashed'}
      borderRadius={'md'}
      borderColor={'orange.01'}
    >
      <HStack justifyContent={'space-between'} w={'100%'}>
        <Text color={'white.01'} fontSize={'xs'} fontWeight={'bold'}>
          Protocol Fee
        </Text>
        <Text color={'white.01'} fontSize={'xs'} fontWeight={800}>
          {`${
            assetAmount && protocolFeeBasisPoints
              ? getFeeAmount(assetAmount, protocolFeeBasisPoints)
              : 0
          }
          BTC`}
        </Text>{' '}
      </HStack>
      <Text color={'white.02'} fontSize={'xs'}>
        {`~
        ${
          assetAmount && bitcoinPrice && protocolFeeBasisPoints
            ? calculateProtocolFeeInUSD(assetAmount, bitcoinPrice, protocolFeeBasisPoints)
            : 0
        }
        $`}
      </Text>
    </VStack>
  );
}
