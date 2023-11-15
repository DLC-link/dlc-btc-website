import { Text, VStack } from "@chakra-ui/react";
import { ProtocolHistory } from "@components/protocol-history/protocol-history";

import { ProtocolSummaryStackLayout } from "./components/protocol-summary-stack.layout";

export function ProtocolSummaryStack(): React.JSX.Element {
  return (
    <ProtocolSummaryStackLayout>
      <VStack alignItems={"start"} h={"250px"} w={"50%"} spacing={"15px"}>
        <Text alignContent={"start"} color={"white"} fontSize={"lg"}>
          TVL
        </Text>
        <VStack alignItems={"start"} w={"100%"} spacing={"0px"}>
          <Text
            alignContent={"start"}
            color={"white"}
            fontSize={"3xl"}
            fontWeight={"semibold"}
          >
            1,650.36 dlcBTC
          </Text>
          <Text alignContent={"start"} color={"white"} fontSize={"lg"}>
            $56,425,710.06
          </Text>
        </VStack>
      </VStack>
      <ProtocolHistory />
    </ProtocolSummaryStackLayout>
  );
}
