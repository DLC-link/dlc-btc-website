import { HStack, VStack } from '@chakra-ui/react';
import { VaultVerticalProgressBar } from '@components/vault/components/vault-vertical-progress-bar';
import { TransactionFormAPI } from '@models/form.models';

import { TransactionFormInputField } from '../../transaction-screen.transaction-form.input-field';
import { TransactionFormProgressStack } from '../../transaction-screen.transaction-form.progress-step-stack';

interface TransactionFormProgressStackBurnVariantAProps {
  formAPI: TransactionFormAPI;
  currentBitcoinPrice: number;
}

export function TransactionFormProgressStackBurnVariantA({
  formAPI,
  currentBitcoinPrice,
}: TransactionFormProgressStackBurnVariantAProps): React.JSX.Element {
  return (
    <HStack w={'100%'} justifyContent={'space-between'}>
      <VaultVerticalProgressBar currentStep={0} />
      <VStack w={'85%'}>
        <TransactionFormInputField
          formAPI={formAPI}
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
