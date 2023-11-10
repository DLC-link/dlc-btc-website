import { Text, VStack } from "@chakra-ui/react";

import { exampleProtocolHistoryItems } from "@shared/examples/example-protocol-history-items";

import { ProtocolHistoryItem } from "./components/protocol-history-item";
import { ProtocolHistoryLayout } from "./components/protocol-history.layout";

export function ProtocolHistory(): React.JSX.Element {
  return (
    <ProtocolHistoryLayout>
      <Text alignContent={"start"} color={"white"} fontSize={"lg"}>
        Protocol History
      </Text>
      <VStack overflowX={"scroll"}>
        {exampleProtocolHistoryItems.map((item) => (
          <ProtocolHistoryItem key={item.id} {...item} />
        ))}
      </VStack>
    </ProtocolHistoryLayout>
  );
}
