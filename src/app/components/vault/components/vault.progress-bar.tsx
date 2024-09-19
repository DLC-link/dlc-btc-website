import { Box, Progress, Text, VStack } from '@chakra-ui/react';
import { VaultState } from 'dlc-btc-lib/models';

interface VaultProgressBarProps {
  bitcoinTransactionConfirmations?: number;
  vaultState: VaultState;
}

export function VaultProgressBar({
  bitcoinTransactionConfirmations,
  vaultState,
}: VaultProgressBarProps): React.JSX.Element | false {
  if (vaultState !== VaultState.PENDING) return false;

  const shouldBeIndeterminate =
    bitcoinTransactionConfirmations === undefined ||
    bitcoinTransactionConfirmations === 0 ||
    bitcoinTransactionConfirmations > 6;
  return (
    <VStack w={'100%'} position="relative">
      <Progress
        isIndeterminate={shouldBeIndeterminate}
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
          {shouldBeIndeterminate
            ? 'PROCESSING'
            : `WAITING FOR CONFIRMATIONS: ${bitcoinTransactionConfirmations}/6`}
        </Text>
      </Box>
    </VStack>
  );
}
