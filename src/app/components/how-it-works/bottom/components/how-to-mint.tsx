import { Button, Image, Text } from '@chakra-ui/react';
import { IntroVideo } from '@components/how-it-works/top/components/intro-video';

import { CustomCard } from '../../components/custom-card';
import { FlowStep } from './flow-step';

export function HowToMint(): React.JSX.Element {
  return (
    <CustomCard width={'488px'} height={'970px'} padding={'25px'}>
      {
        <>
          <Text variant={'title'}>How to Mint dlcBTC</Text>
          <Image src={'/images/mintBtc.png'} alt={'mint image'} height={'39px'} width={'185px'} />
          <FlowStep
            step={'Step 1'}
            title={'Deposit Adress'}
            content={
              <Text color={'white'}>
                Select an amount of Bitcoin you would like to lock and confirm it in your{' '}
                <Text as={'span'} color={'rgba(154, 201, 255, 1)'}>
                  Ethereum Wallet.{' '}
                </Text>
                You will receive your deposit token dlcBTC to the same address.
              </Text>
            }
            hasBadge={false}
          />
          <FlowStep
            step={'Step 2'}
            title={'Lock Bitcoin'}
            content={
              <Text color={'white'}>
                Confirm the transaction in your{' '}
                <Text as={'span'} color={'rgba(154, 201, 255, 1)'}>
                  Bitcoin Wallet
                </Text>{' '}
                which will lock your Bitcoin on-chain.
              </Text>
            }
            hasBadge={false}
          />
          <FlowStep
            step={'Step 3'}
            title={'Mint dlcBTC'}
            content={
              <Text color={'white'}>
                Wait for Bitcoin to get locked on chain
                <Text as={'span'} color={'rgba(154, 201, 255, 1)'}>
                  (~1 hour).{' '}
                </Text>
                After confirmation dlcBTC tokens will automatically appear in your{' '}
                <Text as={'span'} color={'rgba(154, 201, 255, 1)'}>
                  Ethereum Wallet.{' '}
                </Text>{' '}
                You can use dlcBTC in big{' '}
                <Text as={'span'} variant={'navigate'}>
                  supported DeFi protocols
                </Text>{' '}
                for lending, yield farming, staking and more.
              </Text>
            }
            hasBadge={false}
          />
          <IntroVideo
            opts={{ height: '262px', width: '435px', playerVars: { autoplay: 0, controls: 1 } }}
            placeholderHeight={'262px'}
            placeholderWidth={'435px'}
          />
          <Button variant={'account'}>Mint dlcBTC</Button>
        </>
      }
    </CustomCard>
  );
}
