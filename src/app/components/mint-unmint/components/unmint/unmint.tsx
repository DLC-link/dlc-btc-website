import { useSelector } from 'react-redux';

import { HStack } from '@chakra-ui/react';
import { usePSBT } from '@hooks/use-psbt';
import { useRisk } from '@hooks/use-risk';
import { RootState } from '@store/index';

import { ProgressTimeline } from '../progress-timeline/progress-timeline';
import { TransactionSummary } from '../transaction-summary/transaction-summary';
import { Walkthrough } from '../walkthrough/walkthrough';
import { UnmintVaultSelector } from './components/unmint-vault-selector';
import { UnmintLayout } from './components/unmint.layout';
import { WithdrawScreen } from './components/withdraw-screen';

export function Unmint(): React.JSX.Element {
  const { handleSignWithdrawTransaction, isLoading: isBitcoinWalletLoading } = usePSBT();

  const { unmintStep } = useSelector((state: RootState) => state.mintunmint);
  const { risk, isLoading } = useRisk();

  return (
    <UnmintLayout>
      <ProgressTimeline variant={'unmint'} currentStep={unmintStep[0]} />
      <HStack w={'100%'} alignItems={'start'} justifyContent={'space-between'}>
        <Walkthrough flow={'unmint'} currentStep={unmintStep[0]} />
        {[0].includes(unmintStep[0]) && (
          <UnmintVaultSelector risk={risk!} isRiskLoading={isLoading} />
        )}
        {[1].includes(unmintStep[0]) && (
          <WithdrawScreen
            currentStep={unmintStep}
            isBitcoinWalletLoading={isBitcoinWalletLoading}
            handleSignWithdrawTransaction={handleSignWithdrawTransaction}
          />
        )}
        {[2].includes(unmintStep[0]) && (
          <TransactionSummary
            currentStep={unmintStep}
            flow={'unmint'}
            blockchain={'bitcoin'}
            width="45%"
          />
        )}
      </HStack>
    </UnmintLayout>
  );
}
