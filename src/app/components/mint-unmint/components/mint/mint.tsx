import { useSelector } from 'react-redux';

import { HStack } from '@chakra-ui/react';
import { useBlockchainContext } from '@hooks/use-blockchain-context';
import { usePSBT } from '@hooks/use-psbt';
import { RootState } from '@store/index';

import { LockScreen } from '../lock-screen/lock-screen';
import { SignClosingTransactionScreen } from '../lock-screen/sign-closing-transaction-screen';
import { ProgressTimeline } from '../progress-timeline/progress-timeline';
import { TransactionForm } from '../transaction-form/transaction-form';
import { TransactionSummary } from '../transaction-summary/transaction-summary';
import { Walkthrough } from '../walkthrough/walkthrough';
import { MintLayout } from './components/mint.layout';

export function Mint(): React.JSX.Element {
  const { bitcoin, ethereum } = useBlockchainContext();
  const psbtHandler = usePSBT(bitcoin);

  const { mintStep } = useSelector((state: RootState) => state.mintunmint);

  return (
    <MintLayout>
      <ProgressTimeline variant={'mint'} currentStep={mintStep[0]} />
      <HStack w={'100%'} alignItems={'start'} justifyContent={'space-between'}>
        <Walkthrough flow={'mint'} currentStep={mintStep[0]} />
        {[0].includes(mintStep[0]) && <TransactionForm />}
        {[1].includes(mintStep[0]) && (
          <LockScreen
            bitcoinHandler={bitcoin}
            ethereumHandler={ethereum}
            psbtHandler={psbtHandler}
            currentStep={mintStep}
          />
        )}
        {[2].includes(mintStep[0]) && (
          <SignClosingTransactionScreen
            bitcoinHandler={bitcoin}
            ethereumHandler={ethereum}
            psbtHandler={psbtHandler}
            currentStep={mintStep}
          />
        )}
        {[3, 4].includes(mintStep[0]) && (
          <TransactionSummary currentStep={mintStep} flow={'mint'} blockchain={'ethereum'} />
        )}
      </HStack>
    </MintLayout>
  );
}
