import { VStack } from '@chakra-ui/react';

import { BottomSection } from './components/bottom-section';
import { HowItWorksLayout } from './components/how-it-works-layout';
import { MiddleSection } from './components/middle-section';
import { TopSection } from './components/top-section';

export function HowItWorks(): React.JSX.Element {
  return (
    <HowItWorksLayout>
      {
        <VStack gap={'100px'}>
          <TopSection />
          <MiddleSection />
          <BottomSection />
        </VStack>
      }
    </HowItWorksLayout>
  );
}
