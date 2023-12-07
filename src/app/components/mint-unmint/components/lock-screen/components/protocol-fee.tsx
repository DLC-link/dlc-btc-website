import { HStack, Text, VStack } from '@chakra-ui/react';

interface LockScreenProtocolFeeProps {
  assetAmount?: number;
  bitcoinPrice?: number;
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
}: LockScreenProtocolFeeProps): React.JSX.Element {
  return (
    <VStack
      alignItems={'end'}
      p={'15px'}
      w={'100%'}
      border={'1px solid'}
      borderRadius={'md'}
      borderColor={'border.cyan.01'}
    >
      <HStack justifyContent={'space-between'} w={'100%'}>
        <Text color={'white.02'} fontSize={'sm'}>
          Protocol Fee
        </Text>
        <Text color={'white.01'} fontSize={'sm'} fontWeight={800}>
          {assetAmount && calculateProtocolFee(assetAmount, 0.0001)} BTC
        </Text>{' '}
      </HStack>
      <Text color={'white.01'} fontSize={'sm'}>
        ={' '}
        {assetAmount &&
          bitcoinPrice &&
          calculateProtocolFeeInUSD(assetAmount, bitcoinPrice, 0.0001)}{' '}
        $
      </Text>
    </VStack>
  );
}
