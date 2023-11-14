import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { modalActions } from "@store/slices/modal/modal.actions";

import { Button, HStack, Image, Text, VStack } from "@chakra-ui/react";

import { SetupInformationStackLayout } from "./components/setup-information-stack.layout";

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
        <VStack alignItems={"start"} h={"150px"} spacing={"2px"}>
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
          <VStack w={"100%"} spacing={"0.5px"}>
            <HStack alignContent={"start"} w={"100%"}>
              <Image src={"/images/logos/ethereum-logo.svg"} h={"15px"}></Image>
              <Text
                color={"accent.cyan.01"}
                fontWeight={"regular"}
                textDecoration={"underline"}
              >
                Metamask Wallet
              </Text>
            </HStack>
            <Text align={"start"} color={"white"} w={"100%"}>
              +ETH (for fee)
            </Text>
          </VStack>
          <VStack w={"100%"} spacing={"0.5px"}>
            <HStack alignContent={"start"} w={"100%"}>
              <Image src={"/images/logos/bitcoin-logo.svg"} h={"15px"}></Image>
              <Text
                color={"accent.orange.01"}
                fontWeight={"regular"}
                textDecoration={"underline"}
              >
                Leather Wallet
              </Text>
            </HStack>
            <Text align={"start"} color={"white"} w={"100%"}>
              +BTC (for lock)
            </Text>
          </VStack>
        </VStack>
      </HStack>
      <Button variant={"account"} onClick={() => onConnectWalletClick()}>
        Connect Wallet
      </Button>
    </SetupInformationStackLayout>
  );
}
