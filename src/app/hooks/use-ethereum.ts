/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { customShiftValue } from '@common/utilities';
import { EthereumError } from '@models/error-types';
import { RawVault, Vault, VaultState } from '@models/vault';
import { VaultContext } from '@providers/vault-context-provider';
import { RootState, store } from '@store/index';
import { vaultActions } from '@store/slices/vault/vault.actions';
import { ethers } from 'ethers';
import { Logger } from 'ethers/lib/utils';

import { useEthereumContext } from './use-ethereum-context';

interface UseEthereumReturnType {
  getDLCBTCBalance: () => Promise<number | undefined>;
  getLockedBTCBalance: () => Promise<number | undefined>;
  totalSupply: number | undefined;
  getAllVaults: () => Promise<void>;
  getVault: (vaultUUID: string, vaultState: VaultState) => Promise<void>;
  setupVault: (btcDepositAmount: number) => Promise<void>;
  closeVault: (vaultUUID: string) => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function throwEthereumError(message: string, error: any): void {
  if (error.code === Logger.errors.CALL_EXCEPTION) {
    throw new EthereumError(
      `${message}${error instanceof Error && 'errorName' in error ? error.errorName : error}`
    );
  } else {
    throw new EthereumError(`${message}${error.code}`);
  }
}

export function useEthereum(): UseEthereumReturnType {
  const { vaults } = useContext(VaultContext);
  const { protocolContract, dlcBTCContract } = useEthereumContext();

  const { address, network } = useSelector((state: RootState) => state.account);

  const [totalSupply, setTotalSupply] = useState<number | undefined>(undefined);

  const fetchTotalSupply = async () => {
    await getTotalSupply();
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchTotalSupply();
  }, [network]);

  function formatVault(vault: RawVault): Vault {
    return {
      uuid: vault.uuid,
      timestamp: vault.timestamp.toNumber(),
      collateral: customShiftValue(vault.valueLocked.toNumber(), 8, true),
      state: vault.status,
      fundingTX: vault.fundingTxId,
      closingTX: vault.closingTxId,
      btcFeeRecipient: vault.btcFeeRecipient,
      btcMintFeeBasisPoints: customShiftValue(vault.btcMintFeeBasisPoints.toNumber(), 4, true),
      btcRedeemFeeBasisPoints: customShiftValue(vault.btcRedeemFeeBasisPoints.toNumber(), 4, true),
    };
  }

  async function getTotalSupply() {
    const provider = ethers.providers.getDefaultProvider(
      'https://ethereum-sepolia.publicnode.com/'
    );
    const branchName = import.meta.env.VITE_ETHEREUM_DEPLOYMENT_BRANCH;
    const contractVersion = import.meta.env.VITE_ETHEREUM_DEPLOYMENT_VERSION;
    const deploymentPlanURL = `https://raw.githubusercontent.com/DLC-link/dlc-solidity/${branchName}/deploymentFiles/sepolia/v${contractVersion}/DLCBTC.json`;

    try {
      const response = await fetch(deploymentPlanURL);
      const contractData = await response.json();
      const protocolContract = new ethers.Contract(
        contractData.contract.address,
        contractData.contract.abi,
        provider
      );
      const totalSupply = await protocolContract.totalSupply();
      setTotalSupply(customShiftValue(totalSupply, 8, true));
    } catch (error) {
      throw new EthereumError(`Could not fetch Total Supply Info: ${error}}`);
    }
  }

  async function getLockedBTCBalance(): Promise<number | undefined> {
    try {
      const totalCollateral = vaults.fundedVaults.reduce(
        (sum: number, vault: Vault) => sum + vault.collateral,
        0
      );
      return Number(totalCollateral.toFixed(5));
    } catch (error) {
      throwEthereumError(`Could not fetch locked BTC balance: `, error);
    }
  }

  async function getDLCBTCBalance(): Promise<number | undefined> {
    try {
      if (!dlcBTCContract) throw new Error('Protocol contract not initialized');
      await dlcBTCContract.callStatic.balanceOf(address);
      const dlcBTCBalance = customShiftValue(await dlcBTCContract.balanceOf(address), 8, true);
      return dlcBTCBalance;
    } catch (error) {
      throwEthereumError(`Could not fetch dlcBTC balance: `, error);
    }
  }

  async function getAllVaults(): Promise<void> {
    try {
      if (!protocolContract) throw new Error('Protocol contract not initialized');
      await protocolContract.callStatic.getAllVaultsForAddress(address);
      const vaults: RawVault[] = await protocolContract.getAllVaultsForAddress(address);
      const formattedVaults: Vault[] = vaults.map(formatVault);
      console.log('formattedVaults', formattedVaults);
      if (!network) return;
      store.dispatch(
        vaultActions.setVaults({
          newVaults: formattedVaults,
          networkID: network?.id,
        })
      );
    } catch (error) {
      throw new EthereumError(`Could not fetch Vaults: ${error}`);
    }
  }

  async function getVault(
    vaultUUID: string,
    vaultState: VaultState,
    retryInterval = 5000,
    maxRetries = 10
  ): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        if (!protocolContract) throw new Error('Protocol contract not initialized');
        const vault: RawVault = await protocolContract.getVault(vaultUUID);
        if (!vault) throw new Error('Vault is undefined');
        if (vault.status !== vaultState) throw new Error('Vault is not in the correct state');
        const formattedVault: Vault = formatVault(vault);
        if (!network) return;
        store.dispatch(
          vaultActions.swapVault({
            vaultUUID,
            updatedVault: formattedVault,
            networkID: network?.id,
          })
        );
        return;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`Error fetching vault ${vaultUUID}. Retrying...`);
      }
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
    throw new EthereumError(`Failed to fetch Vault ${vaultUUID} after ${maxRetries} retries`);
  }

  async function setupVault(btcDepositAmount: number): Promise<void> {
    try {
      if (!protocolContract) throw new Error('Protocol contract not initialized');
      await protocolContract.callStatic.setupVault(btcDepositAmount);
      await protocolContract.setupVault(btcDepositAmount);
    } catch (error: any) {
      throwEthereumError(`Could not setup Vault: `, error);
    }
  }

  async function closeVault(vaultUUID: string) {
    try {
      if (!protocolContract) throw new Error('Protocol contract not initialized');
      await protocolContract.callStatic.closeVault(vaultUUID);
      await protocolContract.closeVault(vaultUUID);
    } catch (error) {
      throwEthereumError(`Could not close Vault: `, error);
    }
  }

  return {
    getDLCBTCBalance,
    totalSupply,
    getLockedBTCBalance,
    getAllVaults,
    getVault,
    setupVault,
    closeVault,
  };
}
