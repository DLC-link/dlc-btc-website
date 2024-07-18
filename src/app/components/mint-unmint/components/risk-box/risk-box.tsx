import { HStack, Link, Text, VStack } from '@chakra-ui/react';

import { RiskBoxLayout } from './components/risk-box.layout';

interface RiskBoxProps {
  risk: string;
  isRiskLoading: boolean;
}

export function RiskBox({ risk }: RiskBoxProps): React.JSX.Element {
  return (
    <RiskBoxLayout>
      <HStack spacing={'5px'}>
        <Text color={'accent.lightBlue.01'} fontSize={'md'} fontWeight={200}>
          Address Risk Level:
        </Text>
        <Text color={'error.01'} fontSize={'md'} fontWeight={800}>
          {risk}
        </Text>
      </HStack>
      <VStack gap={'0px'}>
        <Text color={'white.01'} fontWeight={200}>
          Potential suspicious activity detected, redemptions are temporarily suspended.
        </Text>
        <Text color={'white.01'}>
          <Link
            color={'accent.lightBlue.01'}
            href="mailto:support@dlc.link"
            isExternal
            textDecoration={'underline'}
          >
            Get in touch
          </Link>{' '}
          with your DLC.Link representative to resolve this issue.
        </Text>
      </VStack>
    </RiskBoxLayout>
  );
}
