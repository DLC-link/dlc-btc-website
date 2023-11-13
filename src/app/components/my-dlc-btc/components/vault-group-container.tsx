import { HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { VaultBox } from "@components/dlc-btc-item/vault-box";
import { Vault } from "@models/vault";

interface VaultGroupContainerProps {
  label: string;
  vaults: Vault[];
  isProcessing: boolean;
}

export function VaultGroupContainer({
  label,
  vaults,
  isProcessing,
}: VaultGroupContainerProps): React.JSX.Element | boolean {
  if (vaults.length === 0) return false;

  return (
    <VStack py={"5px"} alignItems={"start"} w={"100%"} spacing={"15px"}>
      <HStack py={"12.5px"} spacing={"25px"}>
        {isProcessing && <Spinner color={"accent.01"} size={"md"} />}
        <Text color={"white"}>{label}</Text>
      </HStack>
      {vaults.map((vault) => (
        <VaultBox {...vault} />
      ))}
    </VStack>
  );
}
