import { useSelector } from 'react-redux';

import { HStack } from '@chakra-ui/react';
import { usePSBT } from '@hooks/use-psbt';
import { useRisk } from '@hooks/use-risk';
import { RootState } from '@store/index';

import { ProgressTimeline } from '../progress-timeline/progress-timeline';
import { Walkthrough } from '../walkthrough/walkthrough';
import { UnmintVaultSelector } from './components/unmint-vault-selector';
import { UnmintLayout } from './components/unmint.layout';
import { WithdrawScreen } from './components/withdraw-screen';

export function Unmint(): React.JSX.Element {
  const { handleSignWithdrawTransaction, isLoading: isBitcoinWalletLoading } = usePSBT();

  const { unmintStep } = useSelector((state: RootState) => state.mintunmint);
  const { risk, fetchUserAddressRisk, isLoading } = useRisk();

  return (
    <UnmintLayout>
      <ProgressTimeline variant={'unmint'} currentStep={unmintStep[0]} />
      <HStack w={'100%'} alignItems={'start'} justifyContent={'space-between'}>
        <Walkthrough flow={'unmint'} currentStep={unmintStep[0]} />
        {[0].includes(unmintStep[0]) && (
          <UnmintVaultSelector
            userEthereumAddressRiskLevel={risk!}
            fetchUserEthereumAddressRiskLevel={fetchUserAddressRisk}
            isUserEthereumAddressRiskLevelLoading={isLoading}
          />
        )}
        {[1, 2].includes(unmintStep[0]) && (
          <WithdrawScreen
            isBitcoinWalletLoading={isBitcoinWalletLoading}
            handleSignWithdrawTransaction={handleSignWithdrawTransaction}
          />
        )}
      </HStack>
    </UnmintLayout>
  );
}
