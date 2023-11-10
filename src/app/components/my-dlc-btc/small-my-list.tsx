import { HStack, Spinner, Text } from "@chakra-ui/react";
import { SmallMyListLayout } from "./components/small-my-list.layout";
import { DlcBtcItem } from "@components/dlc-btc-item/dlc-btc-item";

export function SmallMyList(): React.JSX.Element {
  return (
    <SmallMyListLayout>
      <Text color={"white"} fontWeight={"bold"}>
        My dlcBTC
      </Text>
      <HStack spacing={"25px"}>
        <Spinner color={"secondary.01"} size={"md"} />
        <Text color={"white"}>Locking BTC in Progress</Text>
      </HStack>
      <DlcBtcItem />
    </SmallMyListLayout>
  );
}
