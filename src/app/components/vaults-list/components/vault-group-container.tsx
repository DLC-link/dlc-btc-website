import { HStack, Spinner, Text, VStack } from '@chakra-ui/react';
import { VaultBox } from '@components/dlc-btc-item/vault-box';
import { Vault } from '@models/vault';

import { exampleSkeletonVaults } from '@shared/examples/example-vaults';

interface VaultGroupContainerProps {
  label?: string;
  vaults: Vault[];
  isProcessing?: boolean;
  preventLoad?: boolean;
}

export function VaultGroupContainer({
  label,
  vaults,
  isProcessing,
  preventLoad,
}: VaultGroupContainerProps): React.JSX.Element | boolean {
  if (vaults.length === 0) return false;

  return (
    <VStack py={'5px'} alignItems={'start'} w={'100%'} spacing={'15px'}>
      {label && (
        <HStack py={'12.5px'} spacing={'25px'}>
          {isProcessing && <Spinner color={'accent.cyan.01'} size={'md'} />}
          <Text color={'white'}>{label}</Text>
        </HStack>
      )}
      {preventLoad
        ? exampleSkeletonVaults.map((vault, index) => (
            <VaultBox key={index} {...vault} preventLoad={true} />
          ))
        : vaults.map((vault, index) => <VaultBox key={index} {...vault} />)}
    </VStack>
  );
}
