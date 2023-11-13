import React from "react";

import { HStack } from "@chakra-ui/react";
import { MintUnmintBox } from "@components/mint-unmint-box/mint-unmint-box";
import { VaultList } from "@components/my-dlc-btc/vault-list";

export function Dashboard(): React.JSX.Element {
  return (
    <HStack
      justifyContent={"center"}
      w={"1280px"}
      pt={"50px"}
      pb={"0px"}
      spacing={"20px"}
    >
      <MintUnmintBox />
      <VaultList />
    </HStack>
  );
}
