import { useContext } from 'react';

import { HStack, Text, VStack } from '@chakra-ui/react';
import { TransactionFormNavigateButtonGroup } from '@components/transaction-screen/transaction-screen.transaction-form/components/transaction-screen.transaction-form/components/transaction-screen.transaction-form.navigate-button-group';
import { Vault } from '@components/vault/vault';
import { VaultContext } from '@providers/vault-context-provider';

import { ModalComponentProps } from '../components/modal-container';
import { ModalVaultLayout } from '../components/modal.vault.layout';

interface SuccessfulFlowModalProps extends ModalComponentProps {
  vaultUUID: string;
  flow: 'mint' | 'burn';
  assetAmount: number;
}

function getModalText(flow: 'mint' | 'burn', assetAmount?: number): string {
  if (flow === 'mint') {
    return `You have successfully deposited ${assetAmount} BTC from you Bitcoin Wallet into your Vault, and minted ${assetAmount} dlcBTC to your address.`;
  } else {
    return `You have successfully burned ${assetAmount} dlcBTC from your address, and withdraw ${assetAmount} BTC from your Vault into your Bitcoin Wallet.`;
  }
}

export function SuccessfulFlowModal({
  isOpen,
  handleClose,
  vaultUUID,
  flow,
  assetAmount,
}: SuccessfulFlowModalProps): React.JSX.Element {
  const { allVaults } = useContext(VaultContext);

  const currentVault = allVaults.find(vault => vault.uuid === vaultUUID);

  return (
    <ModalVaultLayout title={'Success!'} isOpen={isOpen} onClose={() => handleClose()}>
      <VStack w={'100%'} spacing={'25px'}>
        <HStack w={'100%'}>
          <Text color={'grey.01'} fontSize={'sm'}>
            {getModalText(flow, assetAmount)}
          </Text>
        </HStack>
        <Vault vault={currentVault!} />
        <TransactionFormNavigateButtonGroup flow={flow} />
      </VStack>
    </ModalVaultLayout>
  );
}
