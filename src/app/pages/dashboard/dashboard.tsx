import React from "react";

import { HStack } from "@chakra-ui/react";
import { MintUnmintBox } from "@components/mint-unmint-box/mint-unmint-box";
import { SmallMyList } from "@components/my-dlc-btc/small-my-list";

export function Dashboard(): React.JSX.Element {
  return (
    <HStack justifyContent={"center"} w={"1280px"} py={"75px"} spacing={"20px"}>
      <MintUnmintBox />
      <SmallMyList />
    </HStack>
  );
}
