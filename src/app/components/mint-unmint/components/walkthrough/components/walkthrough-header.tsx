import { HStack, Text, VStack } from '@chakra-ui/react';

import { WalkthroughBlockchainTag } from './walkthrough-blockchain-tag';

interface WalkthroughHeaderProps {
  blockchain: 'ethereum' | 'bitcoin';
  currentStep?: number;
  title: string;
}

export function WalkthroughHeader({
  currentStep,
  blockchain,
  title,
}: WalkthroughHeaderProps): React.JSX.Element {
  return (
    <VStack alignItems={'start'}>
      <HStack>
        <Text color={'accent.cyan.01'} fontSize={'lg'}>
          Step {currentStep !== undefined && currentStep + 1}
        </Text>
        <WalkthroughBlockchainTag blockchain={blockchain} />
      </HStack>
      <Text color={'white.01'} fontSize={'lg'} fontWeight={800}>
        {title}
      </Text>
    </VStack>
  );
}
