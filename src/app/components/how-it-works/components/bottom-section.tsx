import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';

import { CustomCard } from './custom-card';
import { FlowStep } from './flow-step';

export function BottomSection(): React.JSX.Element {
  return (
    <HStack gap={'25px'} alignItems={'flex-start'}>
      <CustomCard width={'488px'} height={'970px'} padding={'25px'}>
        {
          <>
            <Text variant={'title'}>How to Mint dlcBTC</Text>
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
                  You can use dlcBTC in //TODO: this variant is not good here, the fontSize is too
                  big
                  <Text as={'span'} variant={'navigate'}>
                    supported DeFi protocols
                  </Text>{' '}
                  for lending, yield farming, staking and more.
                </Text>
              }
              hasBadge={false}
            />
            <Box w={'435px'} h={'262px'} backgroundColor={'white.02'}></Box>
            <Button variant={'account'}>Mint dlcBTC</Button>
          </>
        }
      </CustomCard>
      <VStack spacing={'25px'}>
        <CustomCard
          width={'488px'}
          height={'343px'}
          padding={'25px'}
          children={
            <VStack>
              <Text variant={'title'}>How to Unmint dlcBTC</Text>
              <FlowStep
                step={'Step 1'}
                title={'Unmint dlcBTC'}
                content={
                  <Text color={'white'}>
                    Select the vault you would like to unmint. After a successful unmint you will
                    receive BTC in the same amount back to your wallet.
                  </Text>
                }
                hasBadge={false}
              />
              <Button variant={'account'}>Unmint dlcBTC</Button>
            </VStack>
          }
        ></CustomCard>
        <CustomCard
          width={'488px'}
          height={'377px'}
          padding={'25px'}
          children={undefined}
        ></CustomCard>
        <CustomCard
          width={'488px'}
          height={'152px'}
          padding={'25px'}
          children={undefined}
        ></CustomCard>
      </VStack>
    </HStack>
  );
}
