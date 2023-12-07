import { useDispatch, useSelector } from "react-redux";

import { BitcoinError } from "@models/error-types";
import { Vault } from "@models/vault";
import { mintUnmintActions } from "@store/slices/mintunmint/mintunmint.actions";
import { vaultActions } from "@store/slices/vault/vault.actions";

import { useEndpoints } from "./use-endpoints";
import { RootState } from "@store/index";
import { useEffect, useState } from "react";

export interface UseBitcoinReturnType {
  fetchBitcoinContractOfferAndSendToUserWallet: (vault: Vault) => Promise<void>;
  bitcoinPrice: number;
}

export function useBitcoin(): UseBitcoinReturnType {
  const dispatch = useDispatch();
  const { routerWalletURL } = useEndpoints();
  const [bitcoinPrice, setBitcoinPrice] = useState(0);

  useEffect(() => {
    const getBitcoinPrice = async () => {
      await fetchBitcoinPrice();
    };
    getBitcoinPrice();
  }, []);
  const { network } = useSelector((state: RootState) => state.account);

  function createURLParams(bitcoinContractOffer: any) {
    if (!routerWalletURL) {
      throw new BitcoinError("Router wallet URL is undefined");
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
      if (!network) return;
      dispatch(
        vaultActions.setVaultToFunding({
          vaultUUID,
          fundingTX: response.result.txId,
          networkID: network.id,
        }),
      );
      dispatch(mintUnmintActions.setMintStep([2, vaultUUID]));
    } catch (error: any) {
      throw new BitcoinError(
        `Could not send contract offer for signing: ${error.error.message}`,
      );
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
        throw new BitcoinError(responseStream.error.message);
      }
      return responseStream;
    } catch (error: any) {
      throw new BitcoinError(
        `Could not fetch contract offer from counterparty wallet: ${error.message}`,
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

  async function fetchBitcoinPrice() {
    try {
      const response = await fetch(
        "https://api.coindesk.com/v1/bpi/currentprice.json",
        {
          headers: { Accept: "application/json" },
        },
      );
      const message = await response.json();
      const bitcoinUSDPrice = message.bpi.USD.rate_float;
      setBitcoinPrice(bitcoinUSDPrice);
    } catch (error: any) {
      throw new BitcoinError(`Could not fetch bitcoin price: ${error.message}`);
    }
  }

  return {
    fetchBitcoinContractOfferAndSendToUserWallet,
    bitcoinPrice,
  };
}
