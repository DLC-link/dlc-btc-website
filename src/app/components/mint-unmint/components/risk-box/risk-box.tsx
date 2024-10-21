import { HStack, Link, Text, VStack } from '@chakra-ui/react';

import { RiskBoxLayout } from './components/risk-box.layout';

interface RiskBoxProps {
  risk: string;
  isRiskLoading: boolean;
}

export function RiskBox({ risk }: RiskBoxProps): React.JSX.Element | false {
  if (!['High', 'Severe'].includes(risk)) return false;

  return (
    <RiskBoxLayout>
      <HStack w={'100%'}>
        <Text color={'pink.01'} fontSize={'sm'} fontWeight={200}>
          Address Risk Level:
        </Text>
        <Text color={'error.01'} fontSize={'md'} fontWeight={800}>
          {risk}
        </Text>
      </HStack>
      <VStack>
        <HStack w={'100%'}>
          <Text color={'white.01'} fontSize={'small'} fontWeight={'bold'}>
            Potential suspicious activity detected, redemptions are temporarily suspended.
          </Text>
        </HStack>
        <HStack w={'100%'}>
          <Text color={'white.01'} fontSize={'sm'}>
            <Link
              color={'pink.01'}
              href="mailto:support@dlc.link"
              isExternal
              textDecoration={'underline'}
            >
              Get in touch
            </Link>{' '}
            with your DLC.Link representative to resolve this issue.
          </Text>
        </HStack>
      </VStack>
    </RiskBoxLayout>
  );
}
