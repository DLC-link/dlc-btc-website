import { Button, VStack } from "@chakra-ui/react";
import { VaultCard } from "@components/vault/vault-card";
import { VaultStatus } from "@models/vault";

import { exampleVaults } from "@shared/examples/example-vaults";

import { LockScreenProtocolFee } from "./components/protocol-fee";

export function LockScreen(): React.JSX.Element {
  const exampleVault = exampleVaults.find(
    (vault) => vault.state === VaultStatus.READY,
  );

  return (
    <VStack w={"300px"} spacing={"15px"}>
      <VaultCard vault={exampleVault} isSelected />
      <LockScreenProtocolFee assetAmount={exampleVault?.collateral} />
      <Button
        variant={"account"}
        onClick={() =>
          alert(
            "In production your Bitcoin Wallet would now open to confirm the transaction",
          )
        }
      >
        Lock BTC
      </Button>
    </VStack>
  );
}
