import React from 'react';

import { Divider, HStack } from '@chakra-ui/react';

import { ProtocolSummaryStack } from '../protocol-summary-stack/protocol-summary-stack';
import { LandingPageLayout } from './components/landing-page.layout';
import { SetupInformation } from './components/setup-information/setup-informatio';
import { WelcomeStack } from './components/welcome-stack';

export function LandingPage(): React.JSX.Element {
  return (
    <LandingPageLayout>
      <WelcomeStack />
      <Divider orientation={'horizontal'} h={'35px'} variant={'thick'} />
      <HStack w={'100%'} align={'start'} pt={'50px'}>
        <SetupInformation />
        <Divider orientation={'vertical'} w={'35px'} h={'205px'} variant={'thick'} />
        <ProtocolSummaryStack />
      </HStack>
    </LandingPageLayout>
  );
}
