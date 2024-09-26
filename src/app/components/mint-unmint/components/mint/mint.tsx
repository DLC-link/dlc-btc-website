import { useSelector } from 'react-redux';

import { HStack } from '@chakra-ui/react';
import { usePSBT } from '@hooks/use-psbt';
import { useRisk } from '@hooks/use-risk';
import { RootState } from '@store/index';

import { DepositTransactionScreen } from '../deposit-transaction-screen/deposit-transaction-screen';
import { ProgressTimeline } from '../progress-timeline/progress-timeline';
import { SetupVaultScreen } from '../setup-vault-screen/setup-vault-screen';
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
        {[1, 2].includes(mintStep[0]) && (
          <DepositTransactionScreen
            handleSignFundingTransaction={handleSignFundingTransaction}
            isBitcoinWalletLoading={isBitcoinWalletLoading}
            userEthereumAddressRiskLevel={risk!}
            fetchUserEthereumAddressRiskLevel={fetchUserAddressRisk}
            isUserEthereumAddressRiskLevelLoading={isLoading}
          />
        )}
      </HStack>
    </MintLayout>
  );
}
