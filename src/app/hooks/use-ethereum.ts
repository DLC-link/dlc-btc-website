/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { customShiftValue } from '@common/utilities';
import { EthereumError } from '@models/error-types';
import { RawVault, Vault, VaultState } from '@models/vault';
import { EthereumContext } from '@providers/blockchain-context-provider';
import { RootState, store } from '@store/index';
import { vaultActions } from '@store/slices/vault/vault.actions';
import { ethers } from 'ethers';
import { Logger } from 'ethers/lib/utils';

import { useVaults } from './use-vaults';

export interface UseEthereumReturnType {
  getDLCBTCBalance: () => Promise<number | undefined>;
  getLockedBTCBalance: () => Promise<number | undefined>;
  getProtocolFee: () => Promise<number | undefined>;
  totalSupply: number | undefined;
  getAllVaults: () => Promise<void>;
  getVault: (vaultUUID: string, vaultState: VaultState) => Promise<void>;
  setupVault: (btcDepositAmount: number) => Promise<void>;
  closeVault: (vaultUUID: string) => Promise<void>;
  // recommendTokenToMetamask: () => Promise<boolean>;
  isLoaded: boolean;
}

function throwEthereumError(message: string, error: any): void {
  if (error.code === Logger.errors.CALL_EXCEPTION) {
    throw new EthereumError(
      `${message}${error instanceof Error && 'errorName' in error ? error.errorName : error}`
    );
  } else {
    throw new EthereumError(`${message}${error.code}`);
  }
}

export function useEthereum(): UseEthereumReturnType {
  const { ethereumContractConfig } = useContext(EthereumContext);
  const { fundedVaults } = useVaults();
  const { address, network } = useSelector((state: RootState) => state.account);

  const [totalSupply, setTotalSupply] = useState<number | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchTotalSupply = async () => {
      await getTotalSupply();
    };
    fetchTotalSupply();
  }, [network]);

  function formatVault(vault: any): Vault {
    return {
      uuid: vault.uuid,
      collateral: customShiftValue(parseInt(vault.valueLocked), 8, true),
      state: vault.status,
      fundingTX: vault.fundingTxId,
      closingTX: vault.closingTxId,
      timestamp: parseInt(vault.timestamp),
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
      setTotalSupply(customShiftValue(parseInt(totalSupply), 8, true));
    } catch (error) {
      throw new EthereumError(`Could not fetch total supply info: ${error}}`);
    }
  }

  async function getProtocolFee(): Promise<number | undefined> {
    if (!ethereumContractConfig.protocolContract)
      throw new Error('Protocol contract not initialized');
    try {
      const btcMintFeeRate = await ethereumContractConfig.protocolContract.btcMintFeeRate();
      return customShiftValue(btcMintFeeRate.toNumber(), 4, true);
    } catch (error) {
      throwEthereumError(`Could not fetch protocol fee: `, error);
    }
  }

  async function getLockedBTCBalance(): Promise<number | undefined> {
    try {
      const totalCollateral = fundedVaults.reduce(
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
      if (!ethereumContractConfig.dlcBTCContract)
        throw new Error('Protocol contract not initialized');
      await ethereumContractConfig.dlcBTCContract.callStatic.balanceOf(address);
      const dlcBTCBalance = customShiftValue(
        parseInt(await ethereumContractConfig.dlcBTCContract.balanceOf(address)),
        8,
        true
      );
      return dlcBTCBalance;
    } catch (error) {
      throwEthereumError(`Could not fetch dlcBTC balance: `, error);
    }
  }

  async function getAllVaults(): Promise<void> {
    try {
      if (!ethereumContractConfig.protocolContract)
        throw new Error('Protocol contract not initialized');
      await ethereumContractConfig.protocolContract.callStatic.getAllVaultsForAddress(address);
      const vaults: RawVault[] =
        await ethereumContractConfig.protocolContract.getAllVaultsForAddress(address);
      const formattedVaults: Vault[] = vaults.map(formatVault);
      if (!network) return;
      store.dispatch(
        vaultActions.setVaults({
          newVaults: formattedVaults,
          networkID: network?.id,
        })
      );
    } catch (error) {
      throw new Error(`Could not fetch vaults: ${error}`);
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
        if (!ethereumContractConfig.protocolContract)
          throw new Error('Protocol contract not initialized');
        const vault: RawVault = await ethereumContractConfig.protocolContract.getVault(vaultUUID);
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
        console.log(`Error fetching vault ${vaultUUID}. Retrying...`);
      }
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
    throw new EthereumError(`Failed to fetch vault ${vaultUUID} after ${maxRetries} retries`);
  }

  async function setupVault(btcDepositAmount: number): Promise<void> {
    try {
      if (!ethereumContractConfig.protocolContract)
        throw new Error('Protocol contract not initialized');
      await ethereumContractConfig.protocolContract.callStatic.setupVault(btcDepositAmount);
      await ethereumContractConfig.protocolContract.setupVault(btcDepositAmount);
    } catch (error: any) {
      throwEthereumError(`Could not setup vault: `, error);
    }
  }

  async function closeVault(vaultUUID: string) {
    try {
      if (!ethereumContractConfig.protocolContract)
        throw new Error('Protocol contract not initialized');
      await ethereumContractConfig.protocolContract.callStatic.closeVault(vaultUUID);
      await ethereumContractConfig.protocolContract.closeVault(vaultUUID);
    } catch (error) {
      throwEthereumError(`Could not close vault: `, error);
    }
  }

  // async function recommendTokenToMetamask(): Promise<boolean> {
  //   try {
  //     if (!currentWalletType) throw new Error('Wallet not initialized');
  //     const walletProvider = getWalletProvider(currentWalletType);

  //     const response = await walletProvider.request({
  //       method: 'wallet_watchAsset',
  //       params: {
  //         type: 'ERC20',
  //         options: {
  //           address: dlcBTCContract?.address,
  //           symbol: 'dlcBTC',
  //           decimals: 8,
  //           image:
  //             'https://cdn.discordapp.com/attachments/994505799902691348/1035507437748367360/DLC.Link_Emoji.png',
  //         },
  //       },
  //     });
  //     await response.wait();
  //     return response;
  //   } catch (error) {
  //     throwEthereumError(`Could not recommend dlcBTC token to MetaMask: `, error);
  //     return false;
  //   }
  // }

  return {
    getDLCBTCBalance,
    getProtocolFee,
    totalSupply,
    getLockedBTCBalance,
    getAllVaults,
    getVault,
    setupVault,
    closeVault,
    isLoaded,
    // recommendTokenToMetamask,
  };
}
