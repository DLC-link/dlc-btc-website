import { HStack, Text } from '@chakra-ui/react';

interface VaultExpandedInformationTransactionRowProps {
  label: string;
  value: string;
}

export function VaultExpandedInformationTransactionRow({
  label,
  value,
}: VaultExpandedInformationTransactionRowProps): React.JSX.Element {
  return (
    <HStack pl={'35px'} w={'100%'} alignItems={'start'}>
      <Text w={'50%'} color={'white'} fontSize={'xs'}>
        {label}
      </Text>
      <Text
        textAlign={'right'}
        w={'75%'}
        color={'accent.lightBlue.01'}
        fontSize={'xs'}
        textDecoration={'underline'}
        onClick={() =>
          window.open(`${appConfiguration.bitcoinBlockchainExplorerURL}/tx/${value}`, '_blank')
        }
        _hover={{ cursor: 'pointer' }}
      >
        View in TX explorer
      </Text>
    </HStack>
  );
}
