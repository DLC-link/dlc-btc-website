import { Vault } from '@models/vault';
import { RawVault } from 'dlc-btc-lib/models';
import { customShiftValue, unshiftValue } from 'dlc-btc-lib/utilities';

export function formatVault(vault: RawVault): Vault {
  return {
    uuid: vault.uuid,
    timestamp: vault.timestamp.toNumber(),
    collateral: unshiftValue(vault.valueLocked.toNumber()),
    state: vault.status,
    userPublicKey: vault.taprootPubKey,
    fundingTX: vault.fundingTxId,
    closingTX: vault.closingTxId,
    btcFeeRecipient: vault.btcFeeRecipient,
    btcMintFeeBasisPoints: customShiftValue(vault.btcMintFeeBasisPoints.toNumber(), 4, true),
    btcRedeemFeeBasisPoints: customShiftValue(vault.btcRedeemFeeBasisPoints.toNumber(), 4, true),
    taprootPubKey: vault.taprootPubKey,
  };
}

export async function getLockedBTCBalance(fundedVaults: Vault[]): Promise<number | undefined> {
  try {
    const totalCollateral = fundedVaults.reduce(
      (sum: number, vault: Vault) => sum + vault.collateral,
      0
    );
    return Number(totalCollateral.toFixed(5));
  } catch (error) {
    throw new Error(`Could not fetch locked BTC balance: ${error}`);
  }
}
