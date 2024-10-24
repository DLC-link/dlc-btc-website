import { CheckCircleIcon, CopyIcon } from '@chakra-ui/icons';
import { HStack, IconButton, Tooltip } from '@chakra-ui/react';

interface VaultCopyButtonProps {
  onCopyUUID: () => void;
  hasCopiedUUID: boolean;
}

export function VaultCopyButton({
  onCopyUUID,
  hasCopiedUUID,
}: VaultCopyButtonProps): React.JSX.Element {
  return (
    <HStack justifyContent={'flex-end'}>
      <Tooltip
        textAlign={'center'}
        label={hasCopiedUUID ? 'Copied' : 'Copy'}
        bg={'white.04'}
        fontWeight={'bold'}
        placement={'right'}
        fontSize={'xs'}
        w={'60px'}
      >
        <IconButton
          aria-label={'Copy UUID'}
          size={'xs'}
          variant={'ghost'}
          borderRadius={'full'}
          onClick={onCopyUUID}
          icon={
            hasCopiedUUID ? (
              <CheckCircleIcon color={'accent.lightBlue.01'} boxSize={'10px'} />
            ) : (
              <CopyIcon color={'accent.lightBlue.01'} boxSize={'10px'} />
            )
          }
        />
      </Tooltip>
    </HStack>
  );
}
