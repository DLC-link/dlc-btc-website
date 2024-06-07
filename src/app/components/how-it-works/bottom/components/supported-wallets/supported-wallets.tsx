import { HStack, StackDivider, Text } from '@chakra-ui/react';
import { CustomCard } from '@components/how-it-works/components/custom-card';

import { WalletInfo } from './components/wallet-info';

export function SupportedWallets(): React.JSX.Element {
  return (
    <CustomCard width={'488px'} height={'377px'} padding={'25px 0px 25px 25px'}>
      {
        <>
          <Text variant={'title'} pb={'30px'}>
            Supported Wallets
          </Text>
          <HStack divider={<StackDivider borderColor={'white.03'} />}>
            <WalletInfo
              src={'/images/metamask.png'}
              coinName={'Ethereum Wallet:'}
              content={
                <Text color={'white'}>
                  We currently support MetaMask with support for other popular Ethereum wallets
                  coming soon.
                </Text>
              }
            ></WalletInfo>
            <WalletInfo
              src={'/images/leather.png'}
              coinName={'Bitcoin Wallet:'}
              content={
                <Text color={'white'}>
                  Leather Wallet supports DLCs, with Xverse Wallet joining next year. We're actively
                  working to include more Bitcoin Wallets as we grow.
                </Text>
              }
            ></WalletInfo>
          </HStack>
        </>
      }
    </CustomCard>
  );
}
