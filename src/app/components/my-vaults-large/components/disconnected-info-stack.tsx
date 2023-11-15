import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button, Text, VStack } from "@chakra-ui/react";
import { modalActions } from "@store/slices/modal/modal.actions";

export function DisconnectedInfoStack(): React.JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const header = "Connect your\n Ethereum Wallet";
  const link = "Which wallets are supported?";

  function onConnectWalletClick(): void {
    dispatch(modalActions.toggleSelectWalletModalVisibility());
  }

  return (
    <VStack spacing={"25px"} h={"100%"}>
      <VStack alignItems={"start"} spacing={"15px"}>
        <Text
          variant={"welcome"}
          alignContent={"start"}
          pt={"15px"}
          w={"300px"}
        >
          {header}
        </Text>
        <Text variant={"navigate"} onClick={() => navigate("/how-it-works")}>
          {link}
        </Text>
      </VStack>
      <Button variant={"account"} onClick={() => onConnectWalletClick()}>
        Connect Wallet
      </Button>
    </VStack>
  );
}
