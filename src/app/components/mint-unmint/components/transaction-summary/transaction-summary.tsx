import { useNavigate } from "react-router-dom";

import { HStack, Link, Spinner, Stack, Text, VStack } from "@chakra-ui/react";
import { VaultCard } from "@components/vault/vault-card";
import { Vault } from "@models/vault";

import { TransactionSummaryPreviewCard } from "./components/transaction-summary-preview-card";

const flowPropertyMap = {
  mint: {
    title: "Locking BTC in progress",
    subtitle: "Minting dlcBTC",
  },
  unmint: {
    title: "Unmint in progress",
    subtitle: "Your BTC is being unlocked",
  },
};

interface TransactionSummaryProps {
  flow: "mint" | "unmint";
  blockchain: "ethereum" | "bitcoin";
  vault?: Vault;
}

export function TransactionSummary({
  flow,
  blockchain,
  vault,
}: TransactionSummaryProps): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <VStack alignItems={"start"} w={"300px"} spacing={"15px"}>
      <HStack w={"100%"}>
        <Spinner color={"accent.cyan.01"} size={"md"} />
        <Text color={"accent.cyan.01"}>a) {flowPropertyMap[flow].title}:</Text>
      </HStack>
      <VaultCard vault={vault} />
      <Text color={"white.01"}>b) {flowPropertyMap[flow].subtitle}:</Text>
      <TransactionSummaryPreviewCard
        blockchain={blockchain}
        assetAmount={vault?.collateral}
      />
      <Stack
        p={"15px"}
        w={"100%"}
        border={"1px solid"}
        borderRadius={"md"}
        borderColor={"border.cyan.01"}
      >
        <Text color={"white.01"} fontSize={"sm"}>
          You can follow the status of the {flow} under{" "}
          <Link
            color={"accent.cyan.01"}
            textDecoration={"underline"}
            onClick={() => navigate("/my-vaults")}
          >
            My Vaults
          </Link>{" "}
          tab.
        </Text>
      </Stack>
    </VStack>
  );
}
