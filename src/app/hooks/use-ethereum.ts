/* eslint-disable react-hooks/exhaustive-deps */
import { useContext } from 'react';
import { useSelector } from 'react-redux';

import { EthereumError } from '@models/error-types';
import { EthereumNetwork } from '@models/ethereum-network';
import { Vault } from '@models/vault';
import { VaultContext } from '@providers/vault-context-provider';
import { RootState, store } from '@store/index';
import { vaultActions } from '@store/slices/vault/vault.actions';
import { RawVault, VaultState } from 'dlc-btc-lib/models';
import { customShiftValue, unshiftValue } from 'dlc-btc-lib/utilities';
import { ethers } from 'ethers';
import { Logger } from 'ethers/lib/utils';

import { useEthereumContext } from './use-ethereum-context';

const SOLIDITY_CONTRACT_URL = 'https://raw.githubusercontent.com/DLC-link/dlc-solidity';

interface UseEthereumReturnType {
  getDefaultProvider: (
    ethereumNetwork: EthereumNetwork,
    contractName: string
  ) => Promise<ethers.Contract>;
  getDLCBTCBalance: () => Promise<number | undefined>;
  getLockedBTCBalance: () => Promise<number | undefined>;
  getAttestorGroupPublicKey: (ethereumNetwork: EthereumNetwork) => Promise<string>;
  getAllVaults: () => Promise<void>;
  getVault: (vaultUUID: string, vaultState: VaultState) => Promise<Vault>;
  getRawVault: (vaultUUID: string) => Promise<RawVault>;
  getAllFundedVaults: (thereumNetwork: EthereumNetwork) => Promise<RawVault[]>;
  setupVault: () => Promise<void>;
  withdrawVault: (vaultUUID: string, withdrawAmount: bigint) => Promise<void>;
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
  const { fundedVaults } = useContext(VaultContext);
  const { dlcManagerContract, dlcBTCContract, observerDLCManagerContract } = useEthereumContext();

  const { address, network } = useSelector((state: RootState) => state.account);

  function formatVault(vault: RawVault): Vault {
    return {
      uuid: vault.uuid,
      timestamp: vault.timestamp.toNumber(),
      valueLocked: unshiftValue(vault.valueLocked.toNumber()),
      valueMinted: unshiftValue(vault.valueMinted.toNumber()),
      state: vault.status,
      userPublicKey: vault.taprootPubKey,
      fundingTX: vault.fundingTxId,
      closingTX: vault.closingTxId,
      withdrawTX: vault.withdrawTxId,
      btcFeeRecipient: vault.btcFeeRecipient,
      btcMintFeeBasisPoints: vault.btcMintFeeBasisPoints.toNumber(),
      btcRedeemFeeBasisPoints: vault.btcRedeemFeeBasisPoints.toNumber(),
      taprootPubKey: vault.taprootPubKey,
    };
  }

  async function getDefaultProvider(
    ethereumNetwork: EthereumNetwork,
    contractName: string
  ): Promise<ethers.Contract> {
    try {
      const ethereumNetworkName = ethereumNetwork.name.toLowerCase();
      const provider = ethers.providers.getDefaultProvider(ethereumNetwork.defaultNodeURL);

      const deploymentBranchName = import.meta.env.VITE_ETHEREUM_DEPLOYMENT_BRANCH;

      let deploymentPlanURL: string;
      switch (appConfiguration.appEnvironment) {
        case 'mainnet':
        case 'testnet':
        case 'devnet':
          deploymentPlanURL = `${SOLIDITY_CONTRACT_URL}/${deploymentBranchName}/deploymentFiles/${ethereumNetworkName}/${contractName}.json`;
          break;
        case 'localhost':
          deploymentPlanURL = `${import.meta.env.VITE_ETHEREUM_DEPLOYMENT_FILES_URL}/${contractName}.json`;
          break;
        default:
          throw new EthereumError('Invalid Ethereum Network');
      }

      const response = await fetch(deploymentPlanURL);
      const contractData = await response.json();

      const protocolContract = new ethers.Contract(
        contractData.contract.address,
        contractData.contract.abi,
        provider
      );

      return protocolContract;
    } catch (error) {
      throw new EthereumError(`Could not get Default Provider: ${error}}`);
    }
  }

  async function getLockedBTCBalance(): Promise<number | undefined> {
    try {
      const totalCollateral = fundedVaults.reduce(
        (sum: number, vault: Vault) => sum + vault.valueLocked,
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

  async function getAttestorGroupPublicKey(ethereumNetwork: EthereumNetwork): Promise<string> {
    try {
      // const dlcManagerContract = await getDefaultProvider(ethereumNetwork, 'DLCManager');
      const attestorGroupPubKey = await observerDLCManagerContract.attestorGroupPubKey();
      return attestorGroupPubKey;
    } catch (error) {
      throw new EthereumError(`Could not fetch Attestor Public Key: ${error}`);
    }
  }

  async function getAllVaults(): Promise<void> {
    try {
      if (!observerDLCManagerContract) throw new Error('Protocol contract not initialized');
      await observerDLCManagerContract.callStatic.getAllVaultsForAddress(address);
      const vaults: RawVault[] = await observerDLCManagerContract.getAllVaultsForAddress(address);
      const formattedVaults: Vault[] = vaults.map(formatVault);
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

  async function getRawVault(vaultUUID: string): Promise<RawVault> {
    if (!observerDLCManagerContract) throw new Error('Protocol contract not initialized');
    const vault: RawVault = await observerDLCManagerContract.getVault(vaultUUID);
    if (!vault) throw new Error('Vault is undefined');
    return vault;
  }

  async function getVault(
    vaultUUID: string,
    vaultState: VaultState,
    retryInterval = 5000,
    maxRetries = 10
  ): Promise<Vault> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        if (!observerDLCManagerContract) throw new Error('Protocol contract not initialized');
        const vault: RawVault = await observerDLCManagerContract.getVault(vaultUUID);
        if (!vault) throw new Error('Vault is undefined');
        if (vault.status !== vaultState) throw new Error('Vault is not in the correct state');
        const formattedVault: Vault = formatVault(vault);
        if (!network) {
          throw new Error('Network is undefined');
        }
        store.dispatch(
          vaultActions.swapVault({
            vaultUUID,
            updatedVault: formattedVault,
            networkID: network?.id,
          })
        );
        return formattedVault;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`Vault with uuid: ${vaultUUID} is not yet updated. Retrying...`);
      }
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
    throw new EthereumError(`Failed to fetch Vault ${vaultUUID} after ${maxRetries} retries`);
  }

  async function getAllFundedVaults(ethereumNetwork: EthereumNetwork): Promise<RawVault[]> {
    const FUNDED_STATUS = 1;
    try {
      const dlcManagerContract = await getDefaultProvider(ethereumNetwork, 'DLCManager');
      const numToFetch = 50;
      let totalFetched = 0;
      const fundedVaults: RawVault[] = [];
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const fetchedVaults: RawVault[] = await dlcManagerContract.getAllDLCs(
          totalFetched,
          totalFetched + numToFetch
        );
        fundedVaults.push(...fetchedVaults.filter(vault => vault.status === FUNDED_STATUS));
        totalFetched += numToFetch;
        if (fetchedVaults.length !== numToFetch) break;
      }
      return fundedVaults;
    } catch (error) {
      throw new EthereumError(`Could not fetch Funded Vaults: ${error}`);
    }
  }

  async function setupVault(): Promise<void> {
    try {
      if (!dlcManagerContract) throw new Error('Protocol contract not initialized');
      await dlcManagerContract.callStatic.setupVault();
      await dlcManagerContract.setupVault();
    } catch (error: any) {
      throwEthereumError(`Could not setup Vault: `, error);
    }
  }

  async function withdrawVault(vaultUUID: string, withdrawAmount: bigint) {
    if (!dlcManagerContract) throw new Error('Protocol contract not initialized');
    await dlcManagerContract.callStatic.withdraw(vaultUUID, withdrawAmount);
    await dlcManagerContract.withdraw(vaultUUID, withdrawAmount);
  }

  async function closeVault(vaultUUID: string) {
    try {
      if (!dlcManagerContract) throw new Error('Protocol contract not initialized');
      await dlcManagerContract.callStatic.closeVault(vaultUUID);
      await dlcManagerContract.closeVault(vaultUUID);
    } catch (error) {
      throwEthereumError(`Could not close Vault: `, error);
    }
  }

  return {
    getDefaultProvider,
    getDLCBTCBalance,
    getAttestorGroupPublicKey,
    getLockedBTCBalance,
    getAllVaults,
    getVault,
    getRawVault,
    getAllFundedVaults,
    setupVault,
    withdrawVault,
    closeVault,
  };
}
