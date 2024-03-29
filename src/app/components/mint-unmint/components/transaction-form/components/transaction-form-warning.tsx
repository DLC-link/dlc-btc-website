import { HStack, Link, Text } from '@chakra-ui/react';

interface TransactionFormWarningProps {
  assetAmount: number;
}

export function TransactionFormWarning({
  assetAmount,
}: TransactionFormWarningProps): React.JSX.Element {
  return (
    <HStack p={'15px'} bgColor={'white.03'} borderRadius={'md'}>
      <Text color={'white.01'} fontSize={'sm'}>
        <span style={{ fontWeight: 800 }}>Make sure you have {assetAmount} BTC + (fees) </span>
        in your{' '}
        <Link
          isExternal
          href={'https://leather.io/'}
          color={'accent.lightBlue.01'}
          textDecoration={'underline'}
        >
          Leather Wallet
        </Link>{' '}
        before proceeding to the next step.
      </Text>
    </HStack>
  );
}
