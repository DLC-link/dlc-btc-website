import { useDispatch, useSelector } from 'react-redux';

import { HStack } from '@chakra-ui/react';
import { StepButton } from '@components/step-button/step-button';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';

import { ProgressTimeline } from '../progress-timeline/progress-timeline';
import { TransactionSummary } from '../transaction-summary/transaction-summary';
import { Walkthrough } from '../walkthrough/walkthrough';
import { UnmintVaultSelector } from './components/unmint-vault-selector';
import { UnmintLayout } from './components/unmint.layout';

export function Unmint(): React.JSX.Element {
  const dispatch = useDispatch();
  const { unmintStep } = useSelector((state: RootState) => state.mintunmint);

  function handleRestart() {
    dispatch(mintUnmintActions.setUnmintStep(0));
  }

  return (
    <UnmintLayout>
      <ProgressTimeline variant={'unmint'} currentStep={unmintStep[0]} />
      <HStack w={'100%'} alignItems={'start'} justifyContent={'space-between'}>
        <Walkthrough flow={'unmint'} currentStep={unmintStep[0]} />
        {[0].includes(unmintStep[0]) && <UnmintVaultSelector />}
        {[1, 2].includes(unmintStep[0]) && (
          <TransactionSummary currentStep={unmintStep} flow={'unmint'} blockchain={'bitcoin'} />
        )}
      </HStack>
      <StepButton handleClick={handleRestart} />
    </UnmintLayout>
  );
}
