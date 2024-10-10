import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { VStack, useToast } from '@chakra-ui/react';
import { VaultTransactionForm } from '@components/transaction-screen/transaction-screen.transaction-form/components/transaction-screen.transaction-form/transaction-screen.transaction-form';
import { Vault } from '@components/vault/vault';
import { BitcoinWalletContext } from '@providers/bitcoin-wallet-context-provider';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { Client } from 'dlc-btc-lib/models';
import { createCheck, getRippleClient, getRippleWallet } from 'dlc-btc-lib/ripple-functions';
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
  // fetchUserEthereumAddressRiskLevel,
  isUserEthereumAddressRiskLevelLoading,
}: BurnTokenTransactionFormProps): React.JSX.Element {
  const toast = useToast();
  const dispatch = useDispatch();

  const { bitcoinWalletContextState } = useContext(BitcoinWalletContext);

  const { bitcoinPrice, depositLimit } = useContext(ProofOfReserveContext);

  const { unmintStep } = useSelector((state: RootState) => state.mintunmint);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentVault = unmintStep[2];

  async function handleButtonClick(withdrawAmount: number): Promise<void> {
    if (!currentVault) return;
    try {
      setIsSubmitting(true);
      // const currentRisk = await fetchUserEthereumAddressRiskLevel();
      // if (currentRisk === 'High') throw new Error('Risk Level is too high');
      const formattedWithdrawAmount = BigInt(shiftValue(withdrawAmount));

      const rippleWallet = getRippleWallet('sEdSKUhR1Hhwomo7CsUzAe2pv7nqUXT');
      const issuerAddress = 'ra9epzthPkNXykgfadCwu8D7mtajj8DVCP';
      const rippleClient: Client = getRippleClient('wss://s.altnet.rippletest.net:51233');
      await createCheck(
        rippleClient,
        rippleWallet,
        issuerAddress,
        undefined,
        formattedWithdrawAmount.toString(),
        currentVault.uuid.slice(2)
      );

      // const updatedVault = await getAndFormatVault(
      //   currentVault.uuid,
      //   ethereumNetworkConfiguration.dlcManagerContract
      // );
      // dispatch(
      //   vaultActions.swapVault({
      //     vaultUUID: currentVault.uuid,
      //     updatedVault: updatedVault,
      //     networkID: chainId?.toString() as EthereumNetworkID,
      //   })
      // );
      // dispatch(mintUnmintActions.setUnmintStep([1, currentVault.uuid]));
      // setIsSubmitting(false);
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
        isBitcoinWalletLoading={isBitcoinWalletLoading}
        userEthereumAddressRiskLevel={userEthereumAddressRiskLevel}
        isUserEthereumAddressRiskLevelLoading={isUserEthereumAddressRiskLevelLoading}
        handleCancelButtonClick={handleCancel}
        isSubmitting={isSubmitting}
      />
    </VStack>
  );
}
