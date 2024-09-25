import { HStack, VStack } from '@chakra-ui/react';
import { VaultVerticalProgressBar } from '@components/vault/components/vault-vertical-progress-bar';
import { TransactionFormAPI } from '@models/form.models';

import { TransactionFormInputField } from '../../transaction-screen.transaction-form.input';
import { TransactionFormProgressStack } from '../../transaction-screen.transaction-form.progress-step-stack';

interface TransactionFormProgressStackBurnVariantAProps {
  formAPI: TransactionFormAPI;
  currentBitcoinPrice: number;
  currentStep: number;
}

export function TransactionFormProgressStackBurnVariantA({
  formAPI,
  currentStep,
  currentBitcoinPrice,
}: TransactionFormProgressStackBurnVariantAProps): React.JSX.Element {
  return (
    <HStack
      w={'100%'}
      p={'15px 15px 15px 0px'}
      bg={'white.04'}
      border={'1px solid'}
      borderColor={'white.03'}
      borderRadius={'md'}
      justifyContent={'space-between'}
    >
      <VaultVerticalProgressBar currentStep={0} />
      <VStack w={'85%'}>
        <TransactionFormInputField
          formAPI={formAPI}
          currentStep={currentStep}
          currentBitcoinPrice={currentBitcoinPrice}
          formType={'burn'}
        />
        <TransactionFormProgressStack
          label={'Withdraw'}
          assetLogo={'/images/logos/bitcoin-logo.svg'}
          assetSymbol={'BTC'}
          isActive={false}
        />
      </VStack>
    </HStack>
  );
}
