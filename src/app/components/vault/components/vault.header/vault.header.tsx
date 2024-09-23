import { HStack, Stack, Text, useClipboard } from '@chakra-ui/react';
import { truncateAddress } from 'dlc-btc-lib/utilities';

import { VaultCopyButton } from './components/vault.header.copy-button';

interface VaultHeaderProps {
  vaultUUID: string;
  vaultCreationTimestamp: number;
}

export function VaultHeader({
  vaultUUID,
  vaultCreationTimestamp,
}: VaultHeaderProps): React.JSX.Element {
  const { onCopy, hasCopied } = useClipboard(vaultUUID);

  const vaultTruncatedUUID = truncateAddress(vaultUUID);
  const vaultCreationDate = new Date(vaultCreationTimestamp * 1000).toLocaleDateString('en-US');

  return (
    <HStack w={'100%'} justifyContent={'space-between'}>
      <HStack
        w={'67.5%'}
        pl={'15px'}
        bg={'white.04'}
        borderRadius={'full'}
        justifyContent={'space-between'}
      >
        <Stack w={'25%'}>
          <Text fontSize={'xs'} fontWeight={'bold'} color={'white.01'}>
            Vault
          </Text>
        </Stack>
        <Stack w={'50%'}>
          <Text fontSize={'xs'} fontWeight={'bold'} color={'white.01'}>
            {vaultTruncatedUUID}
          </Text>
        </Stack>
        <VaultCopyButton onCopyUUID={onCopy} hasCopiedUUID={hasCopied} />
      </HStack>
      <HStack w={'50%'} justifyContent={'flex-end'}>
        <Text fontSize={'xs'} color={'grey.01'}>
          {vaultCreationDate}
        </Text>
      </HStack>
    </HStack>
  );
}
