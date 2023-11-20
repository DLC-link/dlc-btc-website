import { useState } from "react";

import { Button, Text, VStack } from "@chakra-ui/react";
import { VaultCard } from "@components/vault/vault-card";
import { VaultsListGroupContainer } from "@components/vaults-list/components/vaults-list-group-container";
import { VaultsList } from "@components/vaults-list/vaults-list";
import { useVaults } from "@hooks/use-vaults";
import { Vault } from "@models/vault";

import { scrollBarCSS } from "../../../../../../styles/css-styles";

export function UnmintVaultSelector(): React.JSX.Element {
  const [selectedVault, setSelectedVault] = useState<Vault | undefined>(
    undefined,
  );
  const { fundedVaults } = useVaults();

  function handleSelect(uuid: string): void {
    const vault = fundedVaults.find((vault) => vault.uuid === uuid);
    if (vault) setSelectedVault(vault);
  }

  return (
    <VStack
      alignItems={"start"}
      py={"2.5px"}
      px={"15px"}
      w={"300px"}
      h={"445px"}
      spacing={"15px"}
    >
      <Text color={"accent.cyan.01"} fontSize={"md"} fontWeight={600}>
        Select vault to unmint dlcBTC:
      </Text>
      {selectedVault ? (
        <VStack
          overflowY={"scroll"}
          overflowX={"hidden"}
          alignItems={"start"}
          py={"5px"}
          pr={"15px"}
          w={"100%"}
          css={scrollBarCSS}
        >
          <VaultCard
            vault={selectedVault}
            isSelectable
            isSelected
            handleSelect={() => setSelectedVault(undefined)}
          />
        </VStack>
      ) : (
        <VaultsList height="358.5px" isScrollable={!!selectedVault}>
          <VaultsListGroupContainer
            vaults={fundedVaults}
            isSelectable
            handleSelect={handleSelect}
          />
        </VaultsList>
      )}
      <Button
        variant={"account"}
        isDisabled={!selectedVault}
        onClick={() =>
          alert(
            "In production your Ethereum Wallet would now open to confirm the transaction",
          )
        }
      >
        Unmint dlcBTC
      </Button>
    </VStack>
  );
}
