import { HStack, Text } from '@chakra-ui/react';

interface VaultTransactionRowProps {
  label: string;
  value?: string;
}

export function VaultTransactionRow({
  label,
  value,
}: VaultTransactionRowProps): React.JSX.Element | false {
  if (!value) return false;

  return (
    <HStack w={'100%'} py={'7.5px'}>
      <HStack w={'50%'}>
        <Text color={'white.01'} fontSize={'xs'}>
          {label}
        </Text>
      </HStack>
      <HStack w={'50%'} justifyContent={'flex-end'}>
        <Text
          fontSize={'xs'}
          color={'pink.01'}
          textDecoration={'underline'}
          onClick={() =>
            window.open(`${appConfiguration.bitcoinBlockchainExplorerURL}/tx/${value}`, '_blank')
          }
          _hover={{ cursor: 'pointer' }}
        >
          View in TX explorer
        </Text>
      </HStack>
    </HStack>
  );
}
