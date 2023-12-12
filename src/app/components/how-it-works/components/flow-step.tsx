import { HStack, Text, VStack } from '@chakra-ui/react';

interface FlowStepProps {
  step: string;
  title: string;
  content: string;
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
    <VStack>
      <Text color={'accent.cyan.01'}>{step}</Text>
      {hasBadge ? (
        <HStack>
          <Text color={'white.01'}>{title}</Text>
          <Text>{badge}</Text>
        </HStack>
      ) : (
        <Text color={'white.01'}>{title}</Text>
      )}
      <Text color={'white.01'}>{content}</Text>
    </VStack>
  );
}
