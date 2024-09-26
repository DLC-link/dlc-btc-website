import { HStack } from '@chakra-ui/react';
import { VaultState } from 'dlc-btc-lib/models';

import { VaultExpandedInformationButton } from './components/vault.details.button-group.button';

interface VaultExpandedInformationButtonGroupProps {
  vaultState: VaultState;
  vaultTotalLockedValue: number;
  handleDepositClick: () => void;
  handleWithdrawClick: () => void;
}

export function VaultExpandedInformationButtonGroup({
  vaultState,
  vaultTotalLockedValue,
  handleDepositClick,
  handleWithdrawClick,
}: VaultExpandedInformationButtonGroupProps): React.JSX.Element {
  const isButtonDisabled = vaultState === VaultState.READY || vaultTotalLockedValue === 0;

  return (
    <HStack w={'100%'} justifyContent={'space-between'}>
      <VaultExpandedInformationButton label={'Mint dlcBTC'} onClick={handleDepositClick} />
      <VaultExpandedInformationButton
        label={'Withdraw BTC'}
        isDisabled={isButtonDisabled}
        onClick={handleWithdrawClick}
      />
    </HStack>
  );
}
