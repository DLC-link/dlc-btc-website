// import { Dispatch } from 'react';
import { useDispatch } from "react-redux";

import { Vault } from "@models/vault";
import { vaultActions } from "@store/slices/vault/vault.actions";
import { mintUnmintActions } from "@store/slices/mintunmint/mintunmint.actions";

export interface UseBitcoinReturn {
  fetchBitcoinContractOfferAndSendToUserWallet: (vault: Vault) => Promise<void>;
}

export function useBitcoin(): UseBitcoinReturn {
  // const { getVault } = ethereum;
  const dispatch = useDispatch();
  const routerWalletURL = "https://devnet.dlc.link/okx-wallet";

  function createURLParams(bitcoinContractOffer: any) {
    if (!routerWalletURL) {
      console.error("Wallet type or blockchain not supported");
    }

    const counterPartyWalletDetails = {
      counterpartyWalletURL: routerWalletURL,
      counterpartyWalletName: "DLC.Link",
      counterpartyWalletIcon:
        "https://dlc-public-assets.s3.amazonaws.com/DLC.Link_logo_icon_color.svg",
    };
    const urlParams = {
      bitcoinContractOffer: JSON.stringify(bitcoinContractOffer),
      bitcoinNetwork: JSON.stringify("regtest"),
      counterpartyWalletDetails: JSON.stringify(counterPartyWalletDetails),
    };
    return urlParams;
  }

  async function sendOfferForSigning(urlParams: any, vaultUUID: string) {
    try {
      const response = await window.btc.request(
        "acceptBitcoinContractOffer",
        urlParams,
      );
      console.log("response", response);
      dispatch(
        vaultActions.setVaultToFunding({
          vaultUUID,
          fundingTX: response.result.txId,
        }),
      );
      dispatch(mintUnmintActions.setMintStep(2));
    } catch (error) {
      console.error(`Could not send contract offer for signing: ${error}`);
    }
  }

  async function fetchBitcoinContractOfferFromCounterpartyWallet(vault: Vault) {
    try {
      const response = await fetch(`${routerWalletURL}/offer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid: vault.uuid,
        }),
      });
      const responseStream = await response.json();
      if (!response.ok) {
        throw new Error(responseStream.error);
      }
      return responseStream;
    } catch (error) {
      throw new Error(
        `Could not fetch contract offer from counterparty wallet: ${error}`,
      );
    }
  }

  async function fetchBitcoinContractOfferAndSendToUserWallet(vault: Vault) {
    const bitcoinContractOffer =
      await fetchBitcoinContractOfferFromCounterpartyWallet(vault);
    if (!bitcoinContractOffer) return;
    const urlParams = createURLParams(bitcoinContractOffer);
    await sendOfferForSigning(urlParams, vault.uuid);
  }

  return {
    fetchBitcoinContractOfferAndSendToUserWallet,
  };
}
