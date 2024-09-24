import { HStack, VStack } from '@chakra-ui/react';
import { VaultVerticalProgressBar } from '@components/vault/components/vault-vertical-progress-bar';

import { TransactionFormProgressStack } from '../../transaction-screen.transaction-form.progress-step-stack';

interface TransactionFormProgressStackMintVariantBProps {}

export function TransactionFormProgressStackMintVariantB(): React.JSX.Element {
  return (
    <HStack w={'100%'} justifyContent={'space-between'}>
      <VaultVerticalProgressBar currentStep={1} />
      <VStack w={'85%'}>
        <TransactionFormProgressStack
          label={'Deposited'}
          assetLogo={'/images/logos/bitcoin-logo.svg'}
          assetSymbol={'BTC'}
          isActive={true}
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
