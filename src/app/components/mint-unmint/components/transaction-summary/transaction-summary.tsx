import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, HStack, Spinner, Stack, Text, VStack } from '@chakra-ui/react';
import { VaultCard } from '@components/vault/vault-card';
import { useVaults } from '@hooks/use-vaults';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';

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
    3: { title: 'a) Locking BTC in progress', subtitle: 'Minting dlcBTC' },
    4: { title: 'Minted dlcBTC' },
  },
  unmint: {
    1: {
      title: 'a) Closing vault in progress',
      subtitle: 'BTC is being unlocked',
    },
    2: { title: 'Vault closed' },
  },
};

interface TransactionSummaryProps {
  currentStep: [number, string];
  flow: 'mint' | 'unmint';
  blockchain: 'ethereum' | 'bitcoin';
  width: string;
  handleClose?: () => void;
}

export function TransactionSummary({
  currentStep,
  flow,
  blockchain,
  width,
  handleClose,
}: TransactionSummaryProps): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allVaults } = useVaults();
  const currentVault = allVaults.find(vault => vault.uuid === currentStep[1]);

  const showProcessing =
    (flow === 'mint' && currentStep[0] === 3) || (flow === 'unmint' && currentStep[0] === 1);

  return (
    <VStack alignItems={'start'} w={width} spacing={'15px'}>
      <HStack w={'100%'}>
        {showProcessing && <Spinner color={'accent.lightBlue.01'} size={'md'} />}
        <Text color={'accent.lightBlue.01'}>{flowPropertyMap[flow][currentStep[0]].title}:</Text>
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
      <Stack p={'5px'} w={'100%'}>
        <Text color={'white.01'} fontSize={'sm'}>
          View vault statuses in the My Vaults tab.
        </Text>
      </Stack>
      <HStack w={'100%'} spacing={'10px'}>
        <Button
          variant={'navigate'}
          onClick={() => {
            dispatch(
              flow === 'mint'
                ? mintUnmintActions.setMintStep([0, ''])
                : mintUnmintActions.setUnmintStep([0, ''])
            );
            navigate('/my-vaults');
            handleClose && handleClose();
          }}
        >
          View in My Vaults
        </Button>
        {((flow === 'mint' && currentStep[0] === 3) ||
          (flow === 'unmint' && currentStep[0] === 1)) && (
          <Button
            variant={'navigate'}
            onClick={() => {
              dispatch(
                flow === 'mint'
                  ? mintUnmintActions.setMintStep([0, ''])
                  : mintUnmintActions.setUnmintStep([0, ''])
              );
              handleClose && handleClose();
            }}
          >
            {flow === 'mint' ? 'Create Another Vault' : 'Close Another Vault'}
          </Button>
        )}
      </HStack>
    </VStack>
  );
}
