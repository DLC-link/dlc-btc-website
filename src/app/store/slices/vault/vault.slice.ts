import { Vault, VaultState } from '@models/vault';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { EthereumNetworkID } from 'dlc-btc-lib/models';

interface VaultSliceState {
  vaults: { [key in EthereumNetworkID]: Vault[] };
  status: string;
  error: string | null;
}

const initialVaultState: VaultSliceState = {
  vaults: {
    [EthereumNetworkID.ArbitrumSepolia]: [],
    [EthereumNetworkID.Arbitrum]: [],
  },
  status: 'idle',
  error: null,
};

export const vaultSlice = createSlice({
  name: 'vault',
  initialState: initialVaultState,
  reducers: {
    setVaults: (
      state,
      action: PayloadAction<{ newVaults: Vault[]; networkID: EthereumNetworkID }>
    ) => {
      const { newVaults, networkID } = action.payload;
      const vaultMap = new Map(state.vaults[networkID].map(vault => [vault.uuid, vault]));

      state.vaults[networkID] = newVaults.map((newVault: Vault) => {
        const existingVault = vaultMap.get(newVault.uuid);

        if (!existingVault) {
          return newVault;
        } else {
          const shouldUpdate =
            existingVault.state !== VaultState.FUNDING || newVault.state === VaultState.FUNDED;
          return shouldUpdate ? { ...existingVault, ...newVault } : existingVault;
        }
      });
    },
    swapVault: (
      state,
      action: PayloadAction<{
        vaultUUID: string;
        updatedVault: Vault;
        networkID: EthereumNetworkID;
      }>
    ) => {
      const { vaultUUID, updatedVault, networkID } = action.payload;
      const vaultIndex = state.vaults[networkID].findIndex(vault => vault.uuid === vaultUUID);

      if (vaultIndex === -1) {
        state.vaults[networkID].push(updatedVault);
      } else {
        state.vaults[networkID][vaultIndex] = updatedVault;
      }
    },
    setVaultToFunding: (
      state,
      action: PayloadAction<{
        vaultUUID: string;
        fundingTX: string;
        networkID: EthereumNetworkID;
      }>
    ) => {
      const { vaultUUID, fundingTX, networkID } = action.payload;

      const vaultIndex = state.vaults[networkID].findIndex(vault => vault.uuid === vaultUUID);

      if (vaultIndex === -1) return;

      state.vaults[networkID][vaultIndex].state = VaultState.FUNDING;
      state.vaults[networkID][vaultIndex].fundingTX = fundingTX;
    },
  },
});
