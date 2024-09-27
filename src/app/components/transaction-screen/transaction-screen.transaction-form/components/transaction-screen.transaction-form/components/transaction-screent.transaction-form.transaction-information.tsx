import { HStack, Text } from '@chakra-ui/react';

interface TransactionFormWarningProps {
  flow: 'mint' | 'burn';
  currentStep: number;
  assetAmount: number;
  isBitcoinWalletLoading: [boolean, string];
}

export function TransactionFormTransactionInformation({
  flow,
  currentStep,
  assetAmount,
  isBitcoinWalletLoading,
}: TransactionFormWarningProps): React.JSX.Element | false {
  if (isBitcoinWalletLoading[0] || !(flow === 'mint' && currentStep === 1)) return false;

  return (
    <HStack
      p={'15px'}
      bgColor={'none'}
      border={'1px solid'}
      borderColor={'white.03'}
      borderRadius={'md'}
    >
      <Text color={'white.01'} fontSize={'sm'}>
        <span style={{ fontWeight: 800 }}>Make sure you have {assetAmount} BTC + (fees) </span>
        in your Bitcoin Wallet before proceeding to the next step.
      </Text>
    </HStack>
  );
}
