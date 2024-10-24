import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { VStack, useToast } from '@chakra-ui/react';
import { VaultTransactionForm } from '@components/transaction-screen/transaction-screen.transaction-form/components/transaction-screen.transaction-form/transaction-screen.transaction-form';
import { Vault } from '@components/vault/vault';
import { useEthersSigner } from '@functions/configuration.functions';
import { useXRPWallet } from '@hooks/use-xrp-wallet';
import { BitcoinWalletContext } from '@providers/bitcoin-wallet-context-provider';
import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { NetworkConfigurationContext } from '@providers/network-configuration.provider';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { withdraw } from 'dlc-btc-lib/ethereum-functions';
import { shiftValue } from 'dlc-btc-lib/utilities';

interface BurnTokenTransactionFormProps {
  isBitcoinWalletLoading: [boolean, string];
  userEthereumAddressRiskLevel: string;
  fetchUserEthereumAddressRiskLevel: () => Promise<string>;
  isUserEthereumAddressRiskLevelLoading: boolean;
}

export function BurnTokenTransactionForm({
  isBitcoinWalletLoading,
  userEthereumAddressRiskLevel,
  fetchUserEthereumAddressRiskLevel,
  isUserEthereumAddressRiskLevelLoading,
}: BurnTokenTransactionFormProps): React.JSX.Element {
  const toast = useToast();
  const dispatch = useDispatch();

  const { networkType } = useContext(NetworkConfigurationContext);
  const { bitcoinWalletContextState } = useContext(BitcoinWalletContext);
  const { handleCreateCheck, isLoading } = useXRPWallet();

  const { bitcoinPrice, depositLimit } = useContext(ProofOfReserveContext);

  const { ethereumNetworkConfiguration } = useContext(EthereumNetworkConfigurationContext);

  const signer = useEthersSigner();

  const { unmintStep } = useSelector((state: RootState) => state.mintunmint);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentVault = unmintStep[2];

  async function handleButtonClick(withdrawAmount: number): Promise<void> {
    try {
      if (!currentVault) return;
      setIsSubmitting(true);
      if (networkType === 'xrpl') {
        await handleCreateCheck(currentVault.uuid, withdrawAmount);
      } else if (networkType === 'evm') {
        const currentRisk = await fetchUserEthereumAddressRiskLevel();
        if (currentRisk === 'High') throw new Error('Risk Level is too high');
        const formattedWithdrawAmount = BigInt(shiftValue(withdrawAmount));

        await withdraw(
          ethereumNetworkConfiguration.dlcManagerContract.connect(signer!),
          currentVault.uuid,
          formattedWithdrawAmount
        );
      } else {
        throw new Error('Unsupported Network Type');
      }
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: 'Failed to sign Transaction',
        description: error instanceof Error ? error.message : '',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }

  function handleCancel() {
    dispatch(mintUnmintActions.setUnmintStep([0, '']));
  }

  return (
    <VStack w={'45%'} spacing={'15px'}>
      <Vault vault={currentVault!} variant={'selected'} />
      <VaultTransactionForm
        vault={currentVault!}
        flow={'burn'}
        currentStep={unmintStep[0]}
        currentBitcoinPrice={bitcoinPrice}
        handleButtonClick={handleButtonClick}
        depositLimit={depositLimit}
        bitcoinWalletContextState={bitcoinWalletContextState}
        isBitcoinWalletLoading={
          currentVault?.valueLocked === currentVault?.valueMinted
            ? isLoading
            : isBitcoinWalletLoading
        }
        userEthereumAddressRiskLevel={userEthereumAddressRiskLevel}
        isUserEthereumAddressRiskLevelLoading={isUserEthereumAddressRiskLevelLoading}
        handleCancelButtonClick={handleCancel}
        isSubmitting={isSubmitting}
      />
    </VStack>
  );
}
