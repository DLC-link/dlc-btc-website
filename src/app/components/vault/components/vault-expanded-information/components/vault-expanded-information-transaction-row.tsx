import { HStack, Text } from '@chakra-ui/react';
import { useEndpoints } from '@hooks/use-endpoints';

interface VaultExpandedInformationTransactionRowProps {
  label: string;
  value: string;
}

export function VaultExpandedInformationTransactionRow({
  label,
  value,
}: VaultExpandedInformationTransactionRowProps): React.JSX.Element {
  const { bitcoinExplorerAPIURL } = useEndpoints();

  return (
    <HStack pl={'35px'} w={'100%'} alignItems={'start'}>
      <Text w={'50%'} color={'white'} fontSize={'xs'}>
        {label}
      </Text>
      <Text
        textAlign={'right'}
        w={'75%'}
        color={'accent.cyan.01'}
        fontSize={'xs'}
        textDecoration={'underline'}
        onClick={() => window.open(`${bitcoinExplorerAPIURL}/tx/${value}`, '_blank')}
        _hover={{ cursor: 'pointer' }}
      >
        View in TX explorer
      </Text>
    </HStack>
  );
}
