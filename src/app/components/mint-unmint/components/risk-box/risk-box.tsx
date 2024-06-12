import { useEffect, useState } from 'react';

import { CheckCircleIcon } from '@chakra-ui/icons';
import { HStack, Spinner, Text } from '@chakra-ui/react';

import { RiskBoxLayout } from './components/risk-box.layout';

interface RiskBoxProps {
  risk: string;
  isRiskLoading: boolean;
}

export function RiskBox({ risk, isRiskLoading }: RiskBoxProps): React.JSX.Element {
  const [riskColor, setRiskColor] = useState('accent.lightBlue.01');

  useEffect(() => {
    if (risk === 'Low') setRiskColor('accent.lightBlue.01');
    else if (risk === 'Medium') setRiskColor('warning.01');
    else if (risk === 'High') setRiskColor('error.01');
  }, [risk]);

  return (
    <RiskBoxLayout>
      <Text color={'accent.lightBlue.01'} fontSize={'md'} fontWeight={200}>
        Address Risk Level:
      </Text>
      {!isRiskLoading ? (
        <HStack spacing={'5px'}>
          <Text color={riskColor} fontSize={'md'} fontWeight={800}>
            {risk}
          </Text>
          {risk === 'Low' && <CheckCircleIcon boxSize={'12.5px'} color={'accent.lightBlue.01'} />}
        </HStack>
      ) : (
        <Spinner size={'xs'} color={'white.02'} />
      )}
    </RiskBoxLayout>
  );
}
