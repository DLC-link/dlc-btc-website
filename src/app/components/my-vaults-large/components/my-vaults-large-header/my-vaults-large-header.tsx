import { Divider, HStack, Text, VStack } from "@chakra-ui/react";

import { BalanceInfo } from "./components/balance-info";

interface MyVaultsLargeHeaderProps {
  address?: string;
  dlcBTCBalance?: number;
  lockedBTCBalance?: number;
}

export function MyVaultsLargeHeader({
  address,
  dlcBTCBalance,
  lockedBTCBalance,
}: MyVaultsLargeHeaderProps): React.JSX.Element {
  return (
    <VStack w={"100%"} h={"100px"}>
      <HStack
        w={"100%"}
        h={"150px"}
        justifyContent={"space-between"}
        pr={"25px"}
      >
        <Text color={"white"} fontSize={"4xl"} fontWeight={600}>
          My Vaults
        </Text>
        <HStack w={"450px"} h={"75%"} justifyContent={"space-between"}>
          <Divider orientation={"vertical"} h={"35px"} variant={"thick"} />
          <BalanceInfo
            title={"Available dlcBTC"}
            imageSrc={"/images/logos/dlc-btc-logo.svg"}
            altText={"dlcBTC Logo"}
            number={dlcBTCBalance}
            showNone={!address}
          />
          <Divider orientation={"vertical"} h={"35px"} variant={"thick"} />
          <BalanceInfo
            title={"Locked BTC"}
            imageSrc={"/images/logos/bitcoin-logo.svg"}
            altText={"Bitcoin Logo"}
            number={lockedBTCBalance}
            showNone={!address}
          />
        </HStack>
      </HStack>
      <Divider variant={"thick"} />
    </VStack>
  );
}
