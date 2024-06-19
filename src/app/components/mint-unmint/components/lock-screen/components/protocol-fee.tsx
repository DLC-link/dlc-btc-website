import { HStack, Text, VStack } from '@chakra-ui/react';
import Decimal from 'decimal.js';

interface LockScreenProtocolFeeProps {
  assetAmount?: number;
  bitcoinPrice?: number;
  protocolFeePercentage?: number;
}

function calculateProtocolFee(amount: number, feeBasisPoints: number): string {
  const feePercentage = new Decimal(feeBasisPoints).dividedBy(100);
  return new Decimal(amount).times(feePercentage.dividedBy(100)).toString();
}

function calculateProtocolFeeInUSD(
  assetAmount: number,
  usdPrice: number,
  feeBasisPoints: number
): string {
  const result = new Decimal(assetAmount)
    .mul(new Decimal(feeBasisPoints).div(100))
    .mul(new Decimal(usdPrice));

  return result.toNumber().toLocaleString('en-US');
}

export function LockScreenProtocolFee({
  assetAmount,
  bitcoinPrice,
  protocolFeePercentage,
}: LockScreenProtocolFeeProps): React.JSX.Element {
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
            protocolFeePercentage &&
            calculateProtocolFee(assetAmount, protocolFeePercentage)
          }
          BTC`}
        </Text>{' '}
      </HStack>
      <Text color={'white.02'} fontSize={'xs'}>
        {`~
        ${
          assetAmount &&
          bitcoinPrice &&
          protocolFeePercentage &&
          calculateProtocolFeeInUSD(assetAmount, bitcoinPrice, protocolFeePercentage)
        }
        $`}
      </Text>
    </VStack>
  );
}
