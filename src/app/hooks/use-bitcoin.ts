// import { Dispatch } from 'react';
import { useDispatch } from "react-redux";

import { Vault } from "@models/vault";
import { mintUnmintActions } from "@store/slices/mintunmint/mintunmint.actions";
import { vaultActions } from "@store/slices/vault/vault.actions";

import { useEndpoints } from "./use-endpoints";

export interface UseBitcoinReturnType {
  fetchBitcoinContractOfferAndSendToUserWallet: (vault: Vault) => Promise<void>;
}

export function useBitcoin(): UseBitcoinReturnType {
  const dispatch = useDispatch();
  const { routerWalletURL } = useEndpoints();

  function createURLParams(bitcoinContractOffer: any) {
    if (!routerWalletURL) {
      throw new Error("Router wallet URL is undefined");
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
      dispatch(
        vaultActions.setVaultToFunding({
          vaultUUID,
          fundingTX: response.result.txId,
        }),
      );
      dispatch(mintUnmintActions.setMintStep(2));
    } catch (error) {
      throw new Error(`Could not send contract offer for signing: ${error}`);
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
