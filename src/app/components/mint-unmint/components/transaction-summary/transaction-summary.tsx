import { Link } from 'react-router-dom';

import { HStack, Spinner, Stack, Text, VStack } from '@chakra-ui/react';
import { VaultCard } from '@components/vault/vault-card';
import { useVaults } from '@hooks/use-vaults';

import { TransactionSummaryPreviewCard } from './components/transaction-summary-preview-card';

interface FlowPropertyMap {
  [key: string]: {
    [key: number]: {
      title: string;
      subtitle?: string;
    };
  };
}

const flowPropertyMap: FlowPropertyMap = {
  mint: {
    2: { title: 'a) Locking BTC in progress', subtitle: 'Minting dlcBTC' },
    3: { title: 'Minted dlcBTC' },
  },
  unmint: {
    1: {
      title: 'a) Closing vault in progress',
      subtitle: 'Your BTC is being unlocked',
    },
    2: { title: 'Vault closed' },
  },
};

interface TransactionSummaryProps {
  currentStep: [number, string];
  flow: 'mint' | 'unmint';
  blockchain: 'ethereum' | 'bitcoin';
}

export function TransactionSummary({
  currentStep,
  flow,
  blockchain,
}: TransactionSummaryProps): React.JSX.Element {
  const { allVaults } = useVaults();
  const currentVault = allVaults.find(vault => vault.uuid === currentStep[1]);

  const showProcessing =
    (flow === 'mint' && currentStep[0] === 2) || (flow === 'unmint' && currentStep[0] === 1);

  return (
    <VStack alignItems={'start'} w={'300px'} spacing={'15px'}>
      <HStack w={'100%'}>
        {showProcessing && <Spinner color={'accent.cyan.01'} size={'md'} />}
        <Text color={'accent.cyan.01'}>{flowPropertyMap[flow][currentStep[0]].title}:</Text>
      </HStack>
      <VaultCard vault={currentVault} />
      {showProcessing && (
        <>
          <Text pt={'25px'} color={'white.01'}>
            b) {flowPropertyMap[flow][currentStep[0]].subtitle}:
          </Text>
          <TransactionSummaryPreviewCard
            blockchain={blockchain}
            assetAmount={currentVault?.collateral}
          />
        </>
      )}
      <Stack
        p={'15px'}
        w={'100%'}
        border={'1px solid'}
        borderRadius={'md'}
        borderColor={'border.cyan.01'}
      >
        <Text color={'white.01'} fontSize={'sm'}>
          You can check all of your vaults' status under{' '}
          <Text as={Link} to={'/my-vaults'} color={'accent.cyan.01'} textDecoration={'underline'}>
            My Vaults
          </Text>{' '}
          tab.
        </Text>
      </Stack>
    </VStack>
  );
}
