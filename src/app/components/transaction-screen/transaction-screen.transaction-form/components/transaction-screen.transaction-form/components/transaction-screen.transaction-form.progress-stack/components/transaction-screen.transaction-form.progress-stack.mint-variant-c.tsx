import { HStack, VStack } from '@chakra-ui/react';
import { VaultVerticalProgressBar } from '@components/vault/components/vault-vertical-progress-bar';

import { TransactionFormProgressStack } from '../../transaction-screen.transaction-form.progress-step-stack';

interface TransactionFormProgressStackMintVariantCProps {}

export function TransactionFormProgressStackMintVariantC(): React.JSX.Element {
  return (
    <HStack w={'100%'} justifyContent={'space-between'}>
      <VaultVerticalProgressBar currentStep={2} />
      <VStack w={'85%'}>
        <TransactionFormProgressStack
          label={'Deposited'}
          assetLogo={'/images/logos/bitcoin-logo.svg'}
          assetSymbol={'BTC'}
          isActive={false}
        />
        <TransactionFormProgressStack
          label={'Minting'}
          assetLogo={'/images/logos/dlc-btc-logo.svg'}
          assetSymbol={'dlcBTC'}
          isActive={true}
        />
      </VStack>
    </HStack>
  );
}
