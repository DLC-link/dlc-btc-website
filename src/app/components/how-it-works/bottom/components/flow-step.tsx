import React from 'react';

import { HStack, Text, VStack } from '@chakra-ui/react';

interface FlowStepProps {
  step: string;
  title: string;
  content: React.ReactNode;
  hasBadge: boolean;
  badge?: string;
}

export function FlowStep({
  step,
  title,
  content,
  hasBadge,
  badge,
}: FlowStepProps): React.JSX.Element {
  return (
    <VStack align={'left'} gap={'0px'}>
      <Text variant={'step'}>{step}</Text>
      {hasBadge ? (
        <HStack>
          <Text variant={'subTitle'}>{title}</Text>
          <Text>{badge}</Text>
        </HStack>
      ) : (
        <Text variant={'subTitle'}>{title}</Text>
      )}
      {content}
    </VStack>
  );
}
