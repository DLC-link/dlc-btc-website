import { HStack, Text, VStack } from '@chakra-ui/react';
import { VaultVerticalProgressBar } from '@components/vault/components/vault-vertical-progress-bar';
import { FormApi, ReactFormApi } from '@tanstack/react-form';

import { TransactionFormFieldInput } from './transaction-screen.transaction-form.field-input';
import { TransactionFormInputUSDText } from './transaction-screen.transaction-form.input-usd-text';
import { TransactionFormProgressStack } from './transaction-screen.transaction-form.progress-step-stack';
import { VaultTransactionFormWarning } from './transaction-screen.transaction-form.warning';

export const formPropertyMap = {
  mint: {
    label: 'Deposit BTC',
    logo: '/images/logos/bitcoin-logo.svg',
    symbol: 'BTC',
    color: 'orange.01',
  },
  burn: {
    label: 'Burn dlcBTC',
    logo: '/images/logos/dlc-btc-logo.svg',
    symbol: 'dlcBTC',
    color: 'purple.01',
  },
};

interface TransactionFormInputFieldProps {
  formAPI: FormApi<
    {
      assetAmount: string;
    },
    undefined
  > &
    ReactFormApi<
      {
        assetAmount: string;
      },
      undefined
    >;
  formType: 'mint' | 'burn';
  currentBitcoinPrice: number;
}

export function TransactionFormInputField({
  formAPI,
  currentBitcoinPrice,
  formType,
}: TransactionFormInputFieldProps): React.JSX.Element {
  return (
    <formAPI.Field name={'assetAmount'}>
      {field => (
        <VStack
          w={'100%'}
          p={'15px'}
          bg={'white.04'}
          border={'1px solid'}
          borderColor={'white.03'}
          borderRadius={'md'}
        >
          <Text w={'100%'} fontWeight={'bold'} color={'accent.lightBlue.01'}>
            {formPropertyMap[formType].label}
          </Text>
          <TransactionFormFieldInput
            assetLogo={formPropertyMap[formType].logo}
            assetSymbol={formPropertyMap[formType].symbol}
            formField={field}
          />
          <TransactionFormInputUSDText
            errors={field.state.meta.errors}
            assetAmount={field.state.value}
            currentBitcoinPrice={currentBitcoinPrice}
          />
          <VaultTransactionFormWarning formErrors={field.state.meta.errors} />
        </VStack>
      )}
    </formAPI.Field>
  );
}
