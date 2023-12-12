import { Box, VStack } from '@chakra-ui/react';

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
          <Box px={'25px'} w={'100vw'} h={'700px'}></Box>
        </VStack>
      }
    </HowItWorksLayout>
  );
}
