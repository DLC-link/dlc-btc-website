import { useContext } from 'react';

import { Button, HStack, Image, Link, Text } from '@chakra-ui/react';
import { TutorialVideo } from '@components/tutorial-video/tutorial-video';

import { BlockchainContext } from '../../../../providers/blockchain-context-provider';
import { WalkthroughHeader } from './components/walkthrough-header';
import { WalkthroughLayout } from './components/walkthrough.layout';

interface WalkthroughProps {
  flow: 'mint' | 'unmint';
  currentStep: number;
}

export function Walkthrough({ flow, currentStep }: WalkthroughProps): React.JSX.Element {
  const blockchainContext = useContext(BlockchainContext);
  const ethereum = blockchainContext?.ethereum;

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
                Select an amount of dlcBTC you would like to mint and confirm it in your{' '}
                <Link
                  color={'accent.cyan.01'}
                  href="https://metamask.io/"
                  isExternal
                  textDecoration={'underline'}
                >
                  Ethereum Wallet
                </Link>
                .
              </Text>
              <Text color={'white.01'} fontSize={'md'} fontWeight={800}>
                1 BTC = 1 dlcBTC
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
                Confirm the transaction in your{' '}
                <Link
                  color={'accent.cyan.01'}
                  href="https://leather.io/"
                  isExternal
                  textDecoration={'underline'}
                >
                  Bitcoin Wallet{' '}
                </Link>
                which will lock your Bitcoin on-chain.
              </Text>
            </WalkthroughLayout>
          );
        case 2:
          return (
            <WalkthroughLayout>
              <WalkthroughHeader
                currentStep={currentStep}
                title={'Waiting'}
                blockchain={'bitcoin'}
              />
              <Text color={'white.01'} fontSize={'md'}>
                Waiting.......
              </Text>
            </WalkthroughLayout>
          );
        case 3:
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
                  color={'accent.cyan.01'}
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
              <Button variant={'vault'} onClick={() => ethereum?.recommendTokenToMetamask()}>
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
                title={'Redeem dlcBTC'}
                blockchain={'ethereum'}
              />
              <Text color={'white.01'} fontSize={'md'}>
                Select the dlcBTC vault you would like to unmint. After a successful unmint you will
                receive BTC in the same amount back to your wallet.
              </Text>
            </WalkthroughLayout>
          );
        case 1:
          return (
            <WalkthroughLayout>
              <WalkthroughHeader
                currentStep={currentStep}
                title={'Wait 24 hours'}
                blockchain={'bitcoin'}
              />
              <Text color={'white.01'} fontSize={'md'}>
                After a successful unmint (<span style={{ color: 'accent.cyan.01' }}>~1 hour</span>)
                your will receive BTC in your bitcoin wallet.
              </Text>
            </WalkthroughLayout>
          );
        case 2:
          return (
            <WalkthroughLayout>
              <WalkthroughHeader
                currentStep={currentStep}
                title={'Claim BTC'}
                blockchain={'bitcoin'}
              />
              <Text color={'white.01'} fontSize={'md'}>
                Click on the "Claim BTC" button and you will receive the AMOUNT in your Bitcoin
                wallet.
              </Text>
            </WalkthroughLayout>
          );
        default:
          return (
            <WalkthroughLayout>
              <WalkthroughHeader
                currentStep={undefined}
                title={'Redeemed dlcBTC'}
                blockchain={'ethereum'}
              />
            </WalkthroughLayout>
          );
      }
  }
}
