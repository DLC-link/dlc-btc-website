import React, { useContext } from 'react';

import { Divider, HStack } from '@chakra-ui/react';
import { TokenStatsBoardTVL } from '@components/proof-of-reserve/components/token-stats-board/components/token-stats-board-tvl';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';

import { LandingPageLayout } from './components/landing-page.layout';
import { SetupInformation } from './components/setup-information/setup-informatio';
import { WelcomeStack } from './components/welcome-stack';

export function LandingPage(): React.JSX.Element {
  const { totalSupply, bitcoinPrice } = useContext(ProofOfReserveContext);
  return (
    <LandingPageLayout>
      <WelcomeStack />
      <Divider orientation={'horizontal'} h={'35px'} variant={'thick'} />
      <HStack w={'100%'} align={'start'} pt={'50px'}>
        <SetupInformation />
        <Divider orientation={'vertical'} w={'35px'} h={'205px'} variant={'thick'} />
        <TokenStatsBoardTVL totalSupply={totalSupply} bitcoinPrice={bitcoinPrice} />
      </HStack>
    </LandingPageLayout>
  );
}
