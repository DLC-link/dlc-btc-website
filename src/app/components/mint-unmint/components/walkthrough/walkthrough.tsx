import { Button, HStack, Image, Link, Text } from '@chakra-ui/react';
import { TutorialVideo } from '@components/tutorial-video/tutorial-video';
import { useAddToken } from '@hooks/use-add-token';

import { WalkthroughHeader } from './components/walkthrough-header';
import { WalkthroughLayout } from './components/walkthrough.layout';

interface WalkthroughProps {
  flow: 'mint' | 'unmint';
  currentStep: number;
}

export function Walkthrough({ flow, currentStep }: WalkthroughProps): React.JSX.Element {
  const addToken = useAddToken();

  switch (flow) {
    case 'mint':
      switch (currentStep) {
        case 0:
          return (
            <WalkthroughLayout>
              <WalkthroughHeader
                currentStep={currentStep}
                title={'Create Vault'}
                blockchain={'ethereum'}
              />
              <Text color={'white.01'} fontSize={'md'}>
                Initiate a Vault on the blockchain and confirm it in your{' '}
                <Link
                  color={'accent.lightBlue.01'}
                  href="https://metamask.io/"
                  isExternal
                  textDecoration={'underline'}
                >
                  Ethereum Wallet
                </Link>
                .
              </Text>
              <TutorialVideo />
            </WalkthroughLayout>
          );
        case 1:
          return (
            <WalkthroughLayout>
              <WalkthroughHeader
                currentStep={currentStep}
                title={'Lock Bitcoin'}
                blockchain={'bitcoin'}
              />
              <Text color={'white.01'} fontSize={'md'}>
                Enter the Bitcoin amount you wish to deposit into the vault, then verify the
                transaction through your{' '}
                <Link
                  color={'accent.lightBlue.01'}
                  href="https://leather.io/"
                  isExternal
                  textDecoration={'underline'}
                >
                  Bitcoin Wallet{' '}
                </Link>
                which will lock your Bitcoin on-chain. You will receive equivalent amount of dlcBTC.
              </Text>
            </WalkthroughLayout>
          );
        case 2:
          return (
            <WalkthroughLayout>
              <WalkthroughHeader
                currentStep={currentStep}
                title={'Mint dlcBTC'}
                blockchain={'ethereum'}
              />
              <Text color={'white.01'} fontSize={'sm'}>
                Wait for Bitcoin to get locked on chain{' '}
                <Link
                  color={'accent.lightBlue.01'}
                  href="https://ethereum.org/"
                  isExternal
                  textDecoration={'underline'}
                >
                  (~1 hour)
                </Link>
                . After 6 confirmations, dlcBTC tokens will appear in your Ethereum Wallet.
              </Text>
              <Text color={'white.01'} fontSize={'sm'}>
                To ensure your <span style={{ fontWeight: 800 }}>dlcBTC tokens </span>
                are <span style={{ fontWeight: 800 }}>visible </span>
                simply <span style={{ fontWeight: 800 }}>add them </span>
                to your Ethereum Wallet.
              </Text>
              <Button variant={'vault'} onClick={async () => await addToken()}>
                <HStack>
                  <Image src={'/images/logos/dlc-btc-logo.svg'} alt={'dlcBTC'} boxSize={'25px'} />
                  <Text> Add Token to Wallet</Text>
                </HStack>
              </Button>
            </WalkthroughLayout>
          );
        default:
          return (
            <WalkthroughLayout>
              <WalkthroughHeader
                currentStep={undefined}
                title={'Minted dlcBTC'}
                blockchain={'ethereum'}
              />
            </WalkthroughLayout>
          );
      }
    case 'unmint':
      switch (currentStep) {
        case 0:
          return (
            <WalkthroughLayout>
              <WalkthroughHeader
                currentStep={currentStep}
                title={'Burn dlcBTC'}
                blockchain={'ethereum'}
              />
              <Text color={'white.01'} fontSize={'md'}>
                Select the dlcBTC vault you would like to withdraw from. Burn the desired amount of
                dlcBTC to receive the equivalent amount of BTC.
              </Text>
            </WalkthroughLayout>
          );
        case 1:
          return (
            <WalkthroughLayout>
              <WalkthroughHeader
                currentStep={currentStep}
                title={'Sign Withdraw Transaction'}
                blockchain={'bitcoin'}
              />
              <Text fontSize={'md'} color={'white.01'}>
                {`Once the dlcBTC has been burned, you can withdraw an `}
                <Text as="span" fontWeight="bold">
                  {` equivalent amount of Bitcoin `}
                </Text>
                {` from the Vault. To do this, sign the Bitcoin transaction using your Bitcoin wallet. After signing, the transaction will be broadcasted, and the amount will be returned to your address.`}
              </Text>
            </WalkthroughLayout>
          );
        case 2:
          return (
            <WalkthroughLayout>
              <WalkthroughHeader
                currentStep={currentStep}
                title={'Receive Bitcoin'}
                blockchain={'bitcoin'}
              />
              <Text color={'white.01'} fontSize={'md'}>
                After a successful withdraw (
                <span style={{ color: 'accent.lightBlue.01' }}>~1 hour</span>) your will receive BTC
                in your bitcoin wallet.
              </Text>
            </WalkthroughLayout>
          );
        default:
          return (
            <WalkthroughLayout>
              <WalkthroughHeader
                currentStep={undefined}
                title={'Withdrawn dlcBTC'}
                blockchain={'ethereum'}
              />
            </WalkthroughLayout>
          );
      }
  }
}
