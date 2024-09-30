import { Box, Progress, Text, VStack } from '@chakra-ui/react';
import { VaultState } from 'dlc-btc-lib/models';

import { BITCOIN_BLOCK_CONFIRMATIONS } from '@shared/constants/bitcoin.constants';

interface VaultProgressBarProps {
  bitcoinTransactionConfirmations?: number;
  vaultState: VaultState;
  vaultTotalLockedValue: number;
  vaultTotalMintedValue: number;
}

export function VaultProgressBar({
  bitcoinTransactionConfirmations,
  vaultState,
}: VaultProgressBarProps): React.JSX.Element | false {
  if (vaultState !== VaultState.PENDING) return false;

  const showProcessing =
    bitcoinTransactionConfirmations === undefined ||
    bitcoinTransactionConfirmations === 0 ||
    bitcoinTransactionConfirmations >= BITCOIN_BLOCK_CONFIRMATIONS;
  return (
    <VStack w={'100%'} position="relative">
      <Progress
        isIndeterminate={showProcessing}
        value={bitcoinTransactionConfirmations}
        isAnimated
        max={6}
        w={'100%'}
        h={'25px'}
        borderRadius={'md'}
      />
      <Box
        display="flex"
        position="absolute"
        alignItems="center"
        justifyContent="center"
        top="0"
        left="0"
        w="100%"
        h="100%"
      >
        <Text color={'white'} fontSize={'xs'} fontWeight={800}>
          {showProcessing
            ? 'PROCESSING'
            : `WAITING FOR CONFIRMATIONS: ${bitcoinTransactionConfirmations}/${BITCOIN_BLOCK_CONFIRMATIONS}`}
        </Text>
      </Box>
    </VStack>
  );
}
