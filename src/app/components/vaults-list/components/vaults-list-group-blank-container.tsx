import { VStack } from "@chakra-ui/react";
import { VaultCardBlank } from "@components/vault/components/vault-card-blank";
import { blankArray } from "@models/blank-array";

export function VaultsListGroupBlankContainer(): React.JSX.Element {
  return (
    <VStack py={"5px"} alignItems={"start"} w={"100%"} spacing={"15px"}>
      {blankArray.map((_, index) => (
        <VaultCardBlank key={index} />
      ))}
    </VStack>
  );
}
