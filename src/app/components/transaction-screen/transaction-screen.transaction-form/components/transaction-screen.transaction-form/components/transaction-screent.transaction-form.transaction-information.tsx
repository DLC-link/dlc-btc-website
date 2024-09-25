import { HStack, Text } from '@chakra-ui/react';
import { Vault } from '@models/vault';
import Decimal from 'decimal.js';

interface TransactionFormWarningProps {
  flow: 'mint' | 'burn';
  vault: Vault;
  currentStep: number;
  assetAmount: number;
  isBitcoinWalletLoading: [boolean, string];
}

export function TransactionFormTransactionInformation({
  flow,
  vault,
  currentStep,
  assetAmount,
  isBitcoinWalletLoading,
}: TransactionFormWarningProps): React.JSX.Element | false {
  if (isBitcoinWalletLoading[0] || [0, 2].includes(currentStep)) return false;

  const amount =
    flow === 'burn' && currentStep === 1
      ? new Decimal(vault.valueLocked).minus(vault.valueMinted).toNumber()
      : assetAmount;
  return (
    <HStack
      p={'15px'}
      bgColor={'none'}
      border={'1px solid'}
      borderColor={'white.03'}
      borderRadius={'md'}
    >
      <Text color={'white.01'} fontSize={'sm'}>
        <span style={{ fontWeight: 800 }}>Make sure you have {amount} BTC + (fees) </span>
        in your Bitcoin Wallet before proceeding to the next step.
      </Text>
    </HStack>
  );
}
