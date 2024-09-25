import { HStack, Text, VStack } from '@chakra-ui/react';
import { Vault } from '@models/vault';
import Decimal from 'decimal.js';
import { getFeeAmount } from 'dlc-btc-lib/bitcoin-functions';

interface TransactionFormProtocolFeeStackProps {
  flow: 'mint' | 'burn';
  vault: Vault;
  currentStep: number;
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
  flow,
  vault,
  currentStep,
  assetAmount,
  bitcoinPrice,
  protocolFeeBasisPoints,
  isBitcoinWalletLoading,
}: TransactionFormProtocolFeeStackProps): React.JSX.Element | false {
  if (isBitcoinWalletLoading[0] || [0, 2].includes(currentStep)) return false;

  const amount =
    flow === 'burn' && currentStep === 1
      ? new Decimal(vault.valueLocked).minus(vault.valueMinted).toNumber()
      : assetAmount;
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
          {`${amount && protocolFeeBasisPoints ? getFeeAmount(amount, protocolFeeBasisPoints) : 0}
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
