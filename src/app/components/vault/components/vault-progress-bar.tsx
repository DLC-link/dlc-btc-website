import { Box, Progress, Text, VStack } from '@chakra-ui/react';
import { VaultState } from '@models/vault';

enum ActionType {
  CONFIRM = 'CONFIRM',
  VERIFY = 'VERIFY',
}

interface VaultProgressBarProps {
  confirmedBlocks: number;
  vaultState: VaultState;
  actionType: ActionType; // replace isConfirm with actionType
}

export function VaultProgressBar({
  confirmedBlocks,
  vaultState,
  actionType = ActionType.CONFIRM, // set default to ActionType.CONFIRM
}: VaultProgressBarProps): React.JSX.Element | boolean {
  const shouldBeIndeterminate = confirmedBlocks > 6 || Number.isNaN(confirmedBlocks);

  const maxBlocks = actionType === ActionType.CONFIRM ? 6 : 24;
  const actionName = actionType === ActionType.CONFIRM ? 'CONFIRMATIONS' : 'VERIFICATION';

  if (vaultState === VaultState.CLOSED && confirmedBlocks > 6) return false;

  return (
    <VStack w={'100%'} alignItems={'end'} position="relative">
      <Progress
        isIndeterminate={shouldBeIndeterminate}
        value={confirmedBlocks}
        max={maxBlocks}
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
            : `WAITING FOR ${actionName}: ${confirmedBlocks}/${maxBlocks}`}
        </Text>
      </Box>
    </VStack>
  );
}
