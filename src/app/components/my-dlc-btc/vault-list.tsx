import { Button, Text, VStack } from "@chakra-ui/react";
import { FadeLayer } from "@components/fade-layer/fade-layer";
import { useVaults } from "@hooks/use-vaults";

import { scrollBarCSS } from "../../../styles/css-styles";
import { VaultGroupContainer } from "./components/vault-group-container";
import { VaultListLayout } from "./components/vault-list.layout";

export function VaultList(): React.JSX.Element {
  const { fundingVaults, closingVaults, fundedVaults, closedVaults } =
    useVaults();

  const vaultGroups = [
    {
      label: "Locking BTC in Progress",
      vaults: fundingVaults,
      isProcessing: true,
    },
    {
      label: "Unlocking BTC in Progress",
      vaults: closingVaults,
      isProcessing: true,
    },
    { label: "Minted dlcBTC", vaults: fundedVaults, isProcessing: false },
    { label: "Closed Vaults", vaults: closedVaults, isProcessing: false },
  ];

  return (
    <VaultListLayout>
      <FadeLayer height={"525px"} fadeHeight={"65px"}>
        <Text pt={"5px"} color={"white"} fontWeight={"bold"}>
          My dlcBTC
        </Text>
        {/* {fundingVaults.length === 0 &&
          closingVaults.length === 0 &&
          fundedVaults.length === 0 &&
          closedVaults.length === 0 && (
            <HStack p={'50px'} h={'350px'}>
              <Text color={'white'}>No Activity</Text>
            </HStack>
          )} */}
        <VStack
          overflowY={"scroll"}
          overflowX={"hidden"}
          alignItems={"start"}
          pb={"125px"}
          pr={"15px"}
          w={"100%"}
          css={scrollBarCSS}
        >
          {vaultGroups.map((group, index) => (
            <VaultGroupContainer
              key={index}
              label={group.label}
              vaults={group.vaults}
              isProcessing={group.isProcessing}
            />
          ))}
        </VStack>
      </FadeLayer>
      <Button variant={"action"}>Show All</Button>
    </VaultListLayout>
  );
}
