import { HStack, Text, VStack } from '@chakra-ui/react';

interface LockScreenProtocolFeeProps {
  assetAmount?: number;
  bitcoinPrice?: number;
  protocolFeePercentage?: number;
}

function calculateProtocolFee(amount: number, protocolFeePercentage: number): string {
  return (amount * protocolFeePercentage).toFixed(8);
}

function calculateProtocolFeeInUSD(
  assetAmount: number,
  usdPrice: number,
  protocolFeePercentage: number
): string {
  return (assetAmount * protocolFeePercentage * usdPrice).toFixed(8);
}

export function LockScreenProtocolFee({
  assetAmount,
  bitcoinPrice,
  protocolFeePercentage,
}: LockScreenProtocolFeeProps): React.JSX.Element {
  return (
    <VStack
      alignItems={'end'}
      p={'15px'}
      w={'100%'}
      border={'1px solid'}
      borderRadius={'md'}
      borderColor={'border.lightBlue.01'}
    >
      <HStack justifyContent={'space-between'} w={'100%'}>
        <Text color={'white.02'} fontSize={'sm'}>
          Protocol Fee
        </Text>
        <Text color={'white.01'} fontSize={'sm'} fontWeight={800}>
          {assetAmount &&
            protocolFeePercentage &&
            calculateProtocolFee(assetAmount, protocolFeePercentage)}{' '}
          BTC
        </Text>{' '}
      </HStack>
      <Text color={'white.01'} fontSize={'sm'}>
        ={' '}
        {assetAmount &&
          bitcoinPrice &&
          protocolFeePercentage &&
          calculateProtocolFeeInUSD(assetAmount, bitcoinPrice, protocolFeePercentage)}{' '}
        $
      </Text>
    </VStack>
  );
}
