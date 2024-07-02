import { HStack, Text, VStack } from '@chakra-ui/react';
import Decimal from 'decimal.js';
import { getFeeAmount } from 'dlc-btc-lib/bitcoin-functions';

interface ProtocolFeeBoxProps {
  assetAmount?: number;
  bitcoinPrice?: number;
  protocolFeeBasisPoints?: number;
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

export function ProtocolFeeBox({
  assetAmount,
  bitcoinPrice,
  protocolFeeBasisPoints,
}: ProtocolFeeBoxProps): React.JSX.Element {
  return (
    <VStack
      alignItems={'end'}
      p={'10px'}
      w={'100%'}
      border={'1px solid'}
      borderRadius={'md'}
      borderColor={'border.lightBlue.01'}
    >
      <HStack justifyContent={'space-between'} w={'100%'}>
        <Text color={'white.02'} fontSize={'xs'}>
          Protocol Fee
        </Text>
        <Text color={'white.01'} fontSize={'xs'} fontWeight={800}>
          {`${
            assetAmount &&
            protocolFeeBasisPoints &&
            getFeeAmount(assetAmount, protocolFeeBasisPoints)
          }
          BTC`}
        </Text>{' '}
      </HStack>
      <Text color={'white.02'} fontSize={'xs'}>
        {`~
        ${
          assetAmount &&
          bitcoinPrice &&
          protocolFeeBasisPoints &&
          calculateProtocolFeeInUSD(assetAmount, bitcoinPrice, protocolFeeBasisPoints)
        }
        $`}
      </Text>
    </VStack>
  );
}
