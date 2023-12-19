import { Stack, Text, VStack } from '@chakra-ui/react';

import { SetupInformationWalletRequirement } from './components/setup-information-wallet-requirement';

export function SetupInformation(): React.JSX.Element {
  return (
    <Stack w={'50%'} align={'center'}>
      <VStack align={'start'} spacing={'25px'}>
        <Text color={'white'} fontSize={'lg'} fontWeight={600}>
          What you will need:
        </Text>
        <SetupInformationWalletRequirement
          logo={'/images/logos/ethereum-logo.svg'}
          color={'accent.cyan.01'}
          walletName={'Metamask Wallet'}
          requirement={'+ETH (for fee)'}
          url={'https://metamask.io/'}
        />
        <SetupInformationWalletRequirement
          logo={'/images/logos/bitcoin-logo.svg'}
          color={'accent.orange.01'}
          walletName={'Leather Wallet'}
          requirement={'+BTC (for lock)'}
          url={'https://leather.io/'}
        />
      </VStack>
    </Stack>
  );
}
