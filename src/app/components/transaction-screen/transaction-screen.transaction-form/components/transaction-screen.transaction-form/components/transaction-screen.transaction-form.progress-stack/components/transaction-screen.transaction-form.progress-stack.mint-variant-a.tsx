import { HStack, VStack } from '@chakra-ui/react';
import { VaultVerticalProgressBar } from '@components/vault/components/vault-vertical-progress-bar';
import { TransactionFormAPI } from '@models/form.models';

import { TransactionFormInputField } from '../../transaction-screen.transaction-form.input-field';
import { TransactionFormProgressStack } from '../../transaction-screen.transaction-form.progress-step-stack';

interface TransactionFormProgressStackMintVariantAProps {
  formAPI: TransactionFormAPI;
  currentBitcoinPrice: number;
}

export function TransactionFormProgressStackMintVariantA({
  formAPI,
  currentBitcoinPrice,
}: TransactionFormProgressStackMintVariantAProps): React.JSX.Element {
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
          currentBitcoinPrice={currentBitcoinPrice}
          formType={'mint'}
        />
        <TransactionFormProgressStack
          label={'Minting'}
          assetLogo={'/images/logos/dlc-btc-logo.svg'}
          assetSymbol={'dlcBTC'}
          isActive={false}
        />
      </VStack>
    </HStack>
  );
}
