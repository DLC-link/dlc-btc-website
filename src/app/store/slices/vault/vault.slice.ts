import { EthereumNetworkID } from '@models/ethereum-network';
import { Vault } from '@models/vault';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface VaultSliceState {
  vaults: { [key in EthereumNetworkID]: Vault[] };
  status: string;
  error: string | null;
}

const initialVaultState: VaultSliceState = {
  vaults: {
    [EthereumNetworkID.ArbSepolia]: [],
    [EthereumNetworkID.Arbitrum]: [],
    [EthereumNetworkID.Hardhat]: [],
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

      state.vaults[networkID] = newVaults;
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
  },
});
