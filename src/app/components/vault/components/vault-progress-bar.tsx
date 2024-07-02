import { Box, Progress, Text, VStack } from '@chakra-ui/react';
import { VaultState } from 'dlc-btc-lib/models';

interface VaultProgressBarProps {
  confirmedBlocks: number;
  vaultState: VaultState;
}

export function VaultProgressBar({
  confirmedBlocks,
  vaultState,
}: VaultProgressBarProps): React.JSX.Element | boolean {
  const shouldBeIndeterminate = confirmedBlocks > 6 || Number.isNaN(confirmedBlocks);

  if (vaultState === VaultState.CLOSED && confirmedBlocks > 6) return false;
  return (
    <VStack w={'100%'} alignItems={'end'} position="relative">
      <Progress
        isIndeterminate={shouldBeIndeterminate}
        value={confirmedBlocks}
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
          {shouldBeIndeterminate ? 'PROCESSING' : `WAITING FOR CONFIRMATIONS: ${confirmedBlocks}/6`}
        </Text>
      </Box>
    </VStack>
  );
}
