import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { modalActions } from "@store/slices/modal/modal.actions";

import { SetupInformationStackLayout } from "./components/setup-information-stack.layout";
import { WalletRequirement } from "./components/wallet-requirement";

export function SetupInformationStack(): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const setupText = "Ready to\n mint dlcBTC?";

  function onConnectWalletClick(): void {
    dispatch(modalActions.toggleSelectWalletModalVisibility());
  }

  return (
    <SetupInformationStackLayout>
      <HStack width={"100%"} spacing={"25px"}>
        <VStack alignItems={"start"} h={"150px"}>
          <Text variant={"welcome"} alignContent={"start"}>
            {setupText}
          </Text>
          <Text variant={"navigate"} onClick={() => navigate("/how-it-works")}>
            How it works?
          </Text>
        </VStack>
        <VStack py={"15px"} h={"150px"}>
          <Image
            src={"/images/dlc-btc-mint-visualization.png"}
            h={"150px"}
          ></Image>
        </VStack>
        <VStack h={"150px"} spacing={"6.5px"}>
          <Text color={"white"} fontSize={"lg"} fontWeight={"bold"}>
            What you will need:
          </Text>
          <WalletRequirement
            logo={"/images/logos/ethereum-logo.svg"}
            color={"accent.cyan.01"}
            walletName={"Metamask Wallet"}
            requirement={"+ETH (for fee)"}
            url={"https://metamask.io/"}
          />
          <WalletRequirement
            logo={"/images/logos/bitcoin-logo.svg"}
            color={"accent.orange.01"}
            walletName={"Leather Wallet"}
            requirement={"+BTC (for lock)"}
            url={"https://leather.io/"}
          />
        </VStack>
      </HStack>
      <Button variant={"account"} onClick={onConnectWalletClick}>
        Connect Wallet
      </Button>
    </SetupInformationStackLayout>
  );
}
