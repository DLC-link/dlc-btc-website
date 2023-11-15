import { HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { VaultCard } from "@components/vault/vault-card";
import { Vault } from "@models/vault";

interface VaultGroupContainerProps {
  label?: string;
  vaults: Vault[];
}

export function VaultGroupContainer({
  label,
  vaults,
}: VaultGroupContainerProps): React.JSX.Element | boolean {
  if (vaults.length === 0) return false;

  return (
    <VStack py={"5px"} alignItems={"start"} w={"100%"} spacing={"15px"}>
      {label && (
        <HStack py={"12.5px"} spacing={"25px"}>
          {["Locking BTC in Progress", "Unlocking BTC in Progress"].includes(
            label,
          ) && <Spinner color={"accent.cyan.01"} size={"md"} />}
          <Text color={"white"}>{label}</Text>
        </HStack>
      )}
      {vaults.map((vault, index) => (
        <VaultCard key={index} {...vault} />
      ))}
    </VStack>
  );
}
