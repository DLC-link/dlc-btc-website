import { VStack } from '@chakra-ui/react';

import { BottomSection } from './bottom/bottom-section';
import { HowItWorksLayout } from './components/how-it-works-layout';
import { MiddleSection } from './middle/middle-section';
import { TopSection } from './top/top-section';

export function HowItWorks(): React.JSX.Element {
  return (
    <HowItWorksLayout>
      {
        <VStack spacing={'100px'}>
          <TopSection />
          <MiddleSection />
          <BottomSection />
        </VStack>
      }
    </HowItWorksLayout>
  );
}
