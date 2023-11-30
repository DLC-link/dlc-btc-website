import { EthereumNetwork } from "@models/network";
import { Vault, VaultState } from "@models/vault";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Vaults {
  1: Vault[];
  5: Vault[];
  6: Vault[];
  195: Vault[];
}
interface VaultSliceState {
  vaults: Vaults;
  status: string;
  error: string | null;
}

const initialVaultsState: Vaults = {
  1: [],
  5: [],
  6: [],
  195: [],
};

const initialVaultState: VaultSliceState = {
  vaults: initialVaultsState,
  status: "idle",
  error: null,
};

export const vaultSlice = createSlice({
  name: "vault",
  initialState: initialVaultState,
  reducers: {
    setVaults: (
      state,
      action: PayloadAction<{ newVaults: Vault[]; networkID: EthereumNetwork }>,
    ) => {
      const { newVaults, networkID } = action.payload;
      const vaultMap = new Map(
        state.vaults[networkID].map((vault) => [vault.uuid, vault]),
      );

      state.vaults[networkID] = newVaults.map((newVault: Vault) => {
        const existingVault = vaultMap.get(newVault.uuid);

        if (!existingVault) {
          return newVault;
        } else {
          const shouldUpdate =
            existingVault.state !== VaultState.FUNDING ||
            newVault.state === VaultState.FUNDED;
          return shouldUpdate
            ? { ...existingVault, ...newVault }
            : existingVault;
        }
      });
    },
    swapVault: (
      state,
      action: PayloadAction<{
        vaultUUID: string;
        updatedVault: Vault;
        networkID: EthereumNetwork;
      }>,
    ) => {
      const { vaultUUID, updatedVault, networkID } = action.payload;
      const vaultIndex = state.vaults[networkID].findIndex(
        (vault) => vault.uuid === vaultUUID,
      );

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
        networkID: EthereumNetwork;
      }>,
    ) => {
      const { vaultUUID, fundingTX, networkID } = action.payload;

      const vaultIndex = state.vaults[networkID].findIndex(
        (vault) => vault.uuid === vaultUUID,
      );

      if (vaultIndex === -1) return;

      state.vaults[networkID][vaultIndex].state = VaultState.FUNDING;
      state.vaults[networkID][vaultIndex].fundingTX = fundingTX;
    },
  },
});
