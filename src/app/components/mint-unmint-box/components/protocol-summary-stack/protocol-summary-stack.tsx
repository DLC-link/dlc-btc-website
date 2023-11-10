import { Text, VStack } from "@chakra-ui/react";
import { ProtocolSummaryStackLayout } from "./components/protocol-summary-stack.layout";
import { ProtocolHistory } from "@components/protocol-history/protocol-history";

export function ProtocolSummaryStack(): React.JSX.Element {
  return (
    <ProtocolSummaryStackLayout>
      <VStack alignItems={"start"} h={"250px"} w={"50%"} spacing={"25px"}>
        <Text alignContent={"start"} color={"white"} fontSize={"lg"}>
          TVL
        </Text>
        <VStack alignItems={"start"} w={"100%"}>
          <Text
            alignContent={"start"}
            color={"white"}
            fontSize={"3xl"}
            fontWeight={"extrabold"}
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
