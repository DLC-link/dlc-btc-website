import { Box, Button, Image, Text } from '@chakra-ui/react';

import { CustomCard } from '../../components/custom-card';
import { FlowStep } from './flow-step';

export function HowToUnmint(): React.JSX.Element {
  return (
    <CustomCard width={'488px'} height={'343px'} padding={'25px'}>
      {
        <>
          <Text variant={'title'}>How to Unmint dlcBTC</Text>
          <Image src={'/images/unmintBtc.png'} alt={'unmint image'} h={'39px'} w={'185px'} />
          <Box h={'25px'} />
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
        </>
      }
    </CustomCard>
  );
}
