import { useSelector } from 'react-redux';

import { HStack } from '@chakra-ui/react';
import { usePSBT } from '@hooks/use-psbt';
import { useRisk } from '@hooks/use-risk';
import { RootState } from '@store/index';

import { ProgressTimeline } from '../progress-timeline/progress-timeline';
import { SetupVaultScreen } from '../setup-vault-screen/setup-vault-screen';
import { SignFundingTransactionScreen } from '../sign-transaction-screen/sign-funding-transaction-screen';
import { TransactionSummary } from '../transaction-summary/transaction-summary';
import { Walkthrough } from '../walkthrough/walkthrough';
import { MintLayout } from './components/mint.layout';

export function Mint(): React.JSX.Element {
  const { handleSignFundingTransaction, isLoading: isBitcoinWalletLoading } = usePSBT();

  const { mintStep } = useSelector((state: RootState) => state.mintunmint);
  const { risk, fetchUserAddressRisk, isLoading } = useRisk();

  return (
    <MintLayout>
      <ProgressTimeline variant={'mint'} currentStep={mintStep[0]} />
      <HStack w={'100%'} alignItems={'start'} justifyContent={'space-between'}>
        <Walkthrough flow={'mint'} currentStep={mintStep[0]} />
        {[0].includes(mintStep[0]) && <SetupVaultScreen />}
        {[1].includes(mintStep[0]) && (
          <SignFundingTransactionScreen
            handleSignFundingTransaction={handleSignFundingTransaction}
            risk={risk!}
            fetchRisk={fetchUserAddressRisk}
            isRiskLoading={isLoading}
            isBitcoinWalletLoading={isBitcoinWalletLoading}
          />
        )}
        {[2].includes(mintStep[0]) && (
          <TransactionSummary
            currentStep={mintStep}
            flow={'mint'}
            blockchain={'ethereum'}
            width="45%"
          />
        )}
      </HStack>
    </MintLayout>
  );
}
