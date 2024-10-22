import { Link, Text, VStack } from '@chakra-ui/react';

export function UpdateBitcoinWalletMessage(): React.JSX.Element {
  return (
    <VStack
      alignItems={'end'}
      p={'15px'}
      w={'100%'}
      border={'1px dashed'}
      borderRadius={'md'}
      borderColor={'orange.01'}
    >
      <Text color={'white'} fontSize={'12px'}>
        Before proceeding, please make sure your Bitcoin Wallet is up to date.
      </Text>
      <Text color={'white'} fontSize={'12px'}>
        If you are using Ledger, ensure both the device firmware and Bitcoin App are updated to
        avoid errors.
      </Text>
      <Text color={'white'} fontSize={'12px'}>
        Use{' '}
        <Link
          color={'orange.01'}
          href="https://support.ledger.com/article/8458939792669-zd"
          isExternal
        >
          Ledger Live
        </Link>{' '}
        to update both firmware and the app easily.
      </Text>
    </VStack>
  );
}
