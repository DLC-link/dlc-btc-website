import { useSelector } from 'react-redux';

import { HStack } from '@chakra-ui/react';
import { RootState } from '@store/index';

import { ProgressTimeline } from '../progress-timeline/progress-timeline';
import { TransactionSummary } from '../transaction-summary/transaction-summary';
import { Walkthrough } from '../walkthrough/walkthrough';
import { UnmintVaultSelector } from './components/unmint-vault-selector';
import { UnmintLayout } from './components/unmint.layout';

export function Unmint(): React.JSX.Element {
  const { unmintStep } = useSelector((state: RootState) => state.mintunmint);

  return (
    <UnmintLayout>
      <ProgressTimeline variant={'unmint'} currentStep={unmintStep[0]} />
      <HStack w={'100%'} alignItems={'start'} justifyContent={'space-between'}>
        <Walkthrough flow={'unmint'} currentStep={unmintStep[0]} />
        {[0].includes(unmintStep[0]) && <UnmintVaultSelector />}
        {[1, 2].includes(unmintStep[0]) && (
          <TransactionSummary
            currentStep={unmintStep}
            flow={'unmint'}
            blockchain={'bitcoin'}
            w="45%"
          />
        )}
      </HStack>
    </UnmintLayout>
  );
}
