import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { HStack, Link, Spinner, Stack, Text, VStack } from "@chakra-ui/react";
import { VaultCard } from "@components/vault/vault-card";
import { useVaults } from "@hooks/use-vaults";
import { Vault } from "@models/vault";

import { TransactionSummaryPreviewCard } from "./components/transaction-summary-preview-card";

interface FlowPropertyMap {
  [key: string]: {
    [key: number]: {
      title: string;
      subtitle: string;
    };
  };
}

const flowPropertyMap: FlowPropertyMap = {
  mint: {
    2: { title: "a) Locking BTC in progress", subtitle: "Minting dlcBTC" },
    3: { title: "Minted dlcBTC", subtitle: "Minting dlcBTC" },
  },
  unmint: {
    1: {
      title: "a) Closing vault in progress",
      subtitle: "Your BTC is being unlocked",
    },
    2: { title: "Vault closed", subtitle: "Your BTC is unlocked" },
  },
};

interface TransactionSummaryProps {
  currentStep: number;
  flow: "mint" | "unmint";
  blockchain: "ethereum" | "bitcoin";
}

export function TransactionSummary({
  currentStep,
  flow,
  blockchain,
}: TransactionSummaryProps): React.JSX.Element {
  const navigate = useNavigate();
  const { fundingVaults, fundedVaults, closingVaults, closedVaults } =
    useVaults();
  const [currentVault, setCurrentVault] = useState<Vault>(
    getVault(flow, currentStep),
  );

  function getVault(flow: "mint" | "unmint", currentStep: number) {
    if (flow === "mint") {
      console.log("fundedVaults", fundedVaults[0]);
      return currentStep === 2 ? fundingVaults[0] : fundedVaults[0];
    } else {
      console.log("closedVaults", closedVaults[0]);
      return currentStep === 1 ? closingVaults[0] : closedVaults[0];
    }
  }

  useEffect(() => {
    setCurrentVault(getVault(flow, currentStep));
  }, [flow, currentStep]);

  return (
    <VStack alignItems={"start"} w={"300px"} spacing={"15px"}>
      <HStack w={"100%"}>
        {(flow === "mint" && currentStep === 2) ||
          (flow === "unmint" && currentStep === 1 && (
            <Spinner color={"accent.cyan.01"} size={"md"} />
          ))}
        <Text color={"accent.cyan.01"}>
          {flowPropertyMap[flow][currentStep].title}:
        </Text>
      </HStack>
      <VaultCard vault={currentVault} />
      {(flow === "mint" && currentStep === 2) ||
      (flow === "unmint" && currentStep === 1) ? (
        <>
          <Text color={"white.01"}>
            b) {flowPropertyMap[flow][currentStep].subtitle}:
          </Text>
          <TransactionSummaryPreviewCard
            blockchain={blockchain}
            assetAmount={currentVault?.collateral}
          />
        </>
      ) : null}
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
