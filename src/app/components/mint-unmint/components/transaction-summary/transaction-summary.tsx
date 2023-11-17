import { useNavigate } from "react-router-dom";

import { HStack, Link, Spinner, Text, VStack } from "@chakra-ui/react";
import { VaultCard } from "@components/vault/vault-card";
import { VaultStatus } from "@models/vault";

import { exampleVaults } from "@shared/examples/example-vaults";

import { DlcBtcCard } from "./components/dlc-btc-card";

export function TransactionSummary(): React.JSX.Element {
  const navigate = useNavigate();
  const exampleVault = exampleVaults.find(
    (vault) => vault.state === VaultStatus.FUNDING,
  );

  return (
    <VStack alignItems={"start"} w={"300px"} spacing={"15px"}>
      <HStack w={"100%"}>
        <Spinner color={"accent.cyan.01"} size={"md"} />
        <Text color={"accent.cyan.01"}>a) Locking BTC in progress:</Text>
      </HStack>
      {exampleVault && <VaultCard {...exampleVault} />}
      <Text color={"white.01"}>b) Minting dlcBTC:</Text>
      <DlcBtcCard />
      <Text color={"white.01"}>
        You can follow the status of the mint under{" "}
        <Link
          color={"accent.cyan.01"}
          textDecoration={"underline"}
          onClick={() => navigate("/my-vaults")}
        >
          My Vaults
        </Link>{" "}
        tab.
      </Text>
    </VStack>
  );
}
