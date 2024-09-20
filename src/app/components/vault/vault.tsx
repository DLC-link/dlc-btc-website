import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Vault as VaultModel } from '@models/vault';
import { BitcoinTransactionConfirmationsContext } from '@providers/bitcoin-query-provider';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';

import { VaultDetails } from './components/vault.detaills/vault.details';
import { VaultHeader } from './components/vault.header/vault.header';
import { VaultLayout } from './components/vault.layout';
import { VaultMainStack } from './components/vault.main-stack/vault-main-stack';
import { VaultProgressBar } from './components/vault.progress-bar';
import { VaultTransactionForm } from './components/vault.timeline/components/vault.timeline.transaction-form/vault.timeline.transaction-form';

interface VaultProps {
  vault: VaultModel;
  variant?: 'select';
}

export function Vault({ vault, variant }: VaultProps): React.JSX.Element {
  const dispatch = useDispatch();
  const [isVaultExpanded, setIsVaultExpanded] = useState(false);

  function handleMainButtonClick() {
    if (variant === 'select') {
      dispatch(mintUnmintActions.setUnmintStep([0, vault.uuid]));
    } else {
      setIsVaultExpanded(!isVaultExpanded);
    }
  }

  const confirmations = useContext(
    BitcoinTransactionConfirmationsContext
  ).bitcoinTransactionConfirmations.find(v => v[0] === vault.uuid)?.[1];

  return (
    <VaultLayout>
      <VaultHeader vaultUUID={vault.uuid} vaultCreationTimestamp={vault.timestamp} />
      <VaultMainStack
        vaultTotalLockedValue={vault.valueLocked}
        vaultTotalMintedValue={vault.valueMinted}
        isVaultExpanded={isVaultExpanded}
        variant={variant}
        handleButtonClick={handleMainButtonClick}
      />
      <VaultDetails
        vaultUUID={vault.uuid}
        vaultState={vault.state}
        vaultTotalLockedValue={vault.valueLocked}
        vaultTotalMintedValue={vault.valueMinted}
        isVaultExpanded={isVaultExpanded}
        vaultFundingTX={vault.fundingTX}
        vaultWithdrawDepositTX={vault.withdrawDepositTX}
      />
      <VaultTransactionForm
        assetLogo={'images/logos/bitcoin-logo.svg'}
        label={'Deposit'}
        currentBitcoinPrice={0}
      />
      <VaultProgressBar bitcoinTransactionConfirmations={confirmations} vaultState={vault.state} />
    </VaultLayout>
  );
}
