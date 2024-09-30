import { Divider, VStack } from '@chakra-ui/react';

import { VaultTransactionRow } from './components/vault.details.transaction-stack.transaction-row';

interface VaultTransactionStackProps {
  vaultFundingTX?: string;
  vaultWithdrawDepositTX?: string;
}

export function VaultTransactionStack({
  vaultFundingTX,
  vaultWithdrawDepositTX,
}: VaultTransactionStackProps): React.JSX.Element | false {
  if (!vaultFundingTX && !vaultWithdrawDepositTX) return false;

  return (
    <VStack w={'100%'} justifyContent={'space-between'}>
      <Divider w={'100%'} borderColor={'grey.01'} borderStyle={'dashed'} />
      <VaultTransactionRow label={'Funding TX'} value={vaultFundingTX} />
      <VaultTransactionRow label={'Withdraw/Deposit TX'} value={vaultWithdrawDepositTX} />
    </VStack>
  );
}
