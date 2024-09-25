import { HStack, VStack } from '@chakra-ui/react';
import { VaultVerticalProgressBar } from '@components/vault/components/vault-vertical-progress-bar';

import { TransactionFormProgressStack } from '../../transaction-screen.transaction-form.progress-step-stack';

export function TransactionFormProgressStackBurnVariantB(): React.JSX.Element {
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
      <VaultVerticalProgressBar currentStep={1} variant={'small'} />
      <VStack w={'85%'}>
        <TransactionFormProgressStack
          label={'Burn'}
          assetLogo={'/images/logos/dlc-btc-logo.svg'}
          assetSymbol={'dlcBTC'}
          isActive={false}
        />
        <TransactionFormProgressStack
          label={'Withdraw'}
          assetLogo={'/images/logos/bitcoin-logo.svg'}
          assetSymbol={'BTC'}
          isActive={true}
        />
      </VStack>
    </HStack>
  );
}
