import { HStack, Image, Text, VStack } from '@chakra-ui/react';
import { VaultState } from 'dlc-btc-lib/models';

import { TransactionBoxLayout } from './transaction-box.layout';

const getAssetLogo = (state: VaultState) => {
  return [VaultState.FUNDED, VaultState.CLOSING, VaultState.CLOSED].includes(state)
    ? '/images/logos/dlc-btc-logo.svg'
    : '/images/logos/bitcoin-logo.svg';
};

interface TransactionBoxProps {
  collateral: number;
  state: VaultState;
}

export function TransactionBox({ state, collateral }: TransactionBoxProps): React.JSX.Element {
  return (
    <TransactionBoxLayout
      children={
        <VStack>
          <Text color={'accent.lightBlue.01'} fontSize={'md'} fontWeight={800}>
            Burn dlcBTC:
          </Text>
          <HStack spacing={'10px'}>
            <Image src={getAssetLogo(state)} alt={'Icon'} boxSize={'25px'} />
            <Text color={'white.01'} fontWeight={800} fontSize={'lg'}>
              {collateral}
            </Text>
          </HStack>
        </VStack>
      }
      handleClick={function (): void {
        throw new Error('Function not implemented.');
      }}
    ></TransactionBoxLayout>
  );
}
