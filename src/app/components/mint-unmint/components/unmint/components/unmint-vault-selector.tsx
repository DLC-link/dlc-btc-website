import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Text, VStack } from '@chakra-ui/react';
import { VaultCard } from '@components/vault/vault-card';
import { VaultsListGroupContainer } from '@components/vaults-list/components/vaults-list-group-container';
import { VaultsList } from '@components/vaults-list/vaults-list';
import { useEthereum } from '@hooks/use-ethereum';
import { useVaults } from '@hooks/use-vaults';
import { Vault } from '@models/vault';
import {
  BitcoinWalletContext,
  BitcoinWalletContextState,
} from '@providers/bitcoin-wallet-context-provider';
import { RootState } from '@store/index';
import { modalActions } from '@store/slices/modal/modal.actions';
import { scrollBarCSS } from '@styles/css-styles';

import { RiskBox } from '../../risk-box/risk-box';
import { WithdrawalForm } from '../../withdrawal-form /withdrawal-form';

interface UnmintVaultSelectorProps {
  handleSignWithdrawTransaction: (vaultUUID: string, withdrawAmount: number) => Promise<void>;
  risk: string;
  fetchRisk: () => Promise<string>;
  isRiskLoading: boolean;
}
export function UnmintVaultSelector({
  handleSignWithdrawTransaction,
  risk,
  fetchRisk,
  isRiskLoading,
}: UnmintVaultSelectorProps): React.JSX.Element {
  const dispatch = useDispatch();
  const { fundedVaults } = useVaults();
  const { closeVault } = useEthereum();

  const { unmintStep } = useSelector((state: RootState) => state.mintunmint);
  const { bitcoinWalletContextState } = useContext(BitcoinWalletContext);

  const [selectedVault, setSelectedVault] = useState<Vault | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [buttonText, setButtonText] = useState('Select Bitcoin Wallet');

  function handleSelect(uuid: string): void {
    const vault = fundedVaults.find(vault => vault.uuid === uuid);
    if (vault) setSelectedVault(vault);
  }

  useEffect(() => {
    switch (bitcoinWalletContextState) {
      case BitcoinWalletContextState.INITIAL:
        setButtonText('Connect Bitcoin Wallet');
        break;
      case BitcoinWalletContextState.READY:
        setButtonText('Sign Funding Transaction');
        break;
      default:
        setButtonText('Connect Bitcoin Wallet');
        break;
    }
  }, [bitcoinWalletContextState]);

  async function handleConnect() {
    dispatch(modalActions.toggleSelectBitcoinWalletModalVisibility());
  }

  useEffect(() => {
    setSelectedVault(fundedVaults.find(vault => vault.uuid === unmintStep[1]));
  }, [fundedVaults, unmintStep]);

  async function handleWithdraw(bitcoinWithdrawalAmount: number): Promise<void> {
    if (selectedVault) {
      try {
        setIsSubmitting(true);
        const currentRisk = await fetchRisk();
        if (currentRisk === 'High') throw new Error('Risk Level is too high');
        await handleSignWithdrawTransaction(selectedVault.uuid, bitcoinWithdrawalAmount);
      } catch (error) {
        setIsSubmitting(false);
        throw new Error(`Error closing vault: ${error}`);
      }
    }
  }

  return (
    <VStack alignItems={'start'} py={'2.5px'} px={'15px'} w={'45%'} h={'445px'} spacing={'15px'}>
      <Text color={'accent.lightBlue.01'} fontSize={'md'} fontWeight={600}>
        Select vault to redeem dlcBTC:
      </Text>
      {selectedVault ? (
        <VStack alignItems={'start'} py={'15px'} w={'100%'} spacing={'15px'} css={scrollBarCSS}>
          <VaultCard
            vault={selectedVault}
            isSelectable
            isSelected
            handleSelect={() => setSelectedVault(undefined)}
          />
          <WithdrawalForm
            buttonText={buttonText}
            handleWithdraw={
              bitcoinWalletContextState === BitcoinWalletContextState.READY
                ? handleWithdraw
                : handleConnect
            }
            isSubmitting={isSubmitting}
          />
        </VStack>
      ) : fundedVaults.length == 0 ? (
        <Text color={'white'}>You don't have any active vaults.</Text>
      ) : (
        <VaultsList height="223.5px" isScrollable={!selectedVault}>
          <VaultsListGroupContainer
            vaults={fundedVaults}
            isSelectable
            handleSelect={handleSelect}
          />
        </VaultsList>
      )}
      {risk === 'High' && <RiskBox risk={risk} isRiskLoading={isRiskLoading} />}
      {/* <Button
        isLoading={isSubmitting}
        variant={'account'}
        isDisabled={!selectedVault || risk === 'High'}
        onClick={() => handleUnmint()}
      >
        Redeem dlcBTC
      </Button> */}
      {selectedVault && (
        <Button
          isDisabled={true}
          isLoading={isSubmitting}
          variant={'navigate'}
          onClick={() => setSelectedVault(undefined)}
        >
          Cancel
        </Button>
      )}
    </VStack>
  );
}
