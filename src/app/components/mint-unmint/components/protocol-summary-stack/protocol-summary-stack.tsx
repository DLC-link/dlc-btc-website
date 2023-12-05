import { Skeleton, Text, VStack } from "@chakra-ui/react";
// import { ProtocolHistory } from "@components/protocol-history/protocol-history";

import { useContext } from "react";
import { BlockchainContext } from "../../../../providers/blockchain-context-provider";
import { ProtocolSummaryStackLayout } from "./components/protocol-summary-stack.layout";

export function ProtocolSummaryStack(): React.JSX.Element {
  const blockchainContext = useContext(BlockchainContext);
  const totalSupply = blockchainContext?.ethereum.totalSupply;
  const bitcoinPrice = blockchainContext?.bitcoin.bitcoinPrice;
  return (
    <ProtocolSummaryStackLayout>
      <VStack alignItems={"start"} h={"250px"} w={"50%"} spacing={"15px"}>
        <Text alignContent={"start"} color={"white"} fontSize={"lg"}>
          TVL
        </Text>
        <VStack alignItems={"start"} w={"100%"} spacing={"0px"}>
          <Skeleton isLoaded={totalSupply !== undefined} w={"100%"}>
            <Text
              alignContent={"start"}
              color={"white"}
              fontSize={"3xl"}
              fontWeight={"semibold"}
            >
              {totalSupply} dlcBTC
            </Text>
          </Skeleton>
          <Skeleton isLoaded={totalSupply !== undefined} w={"100%"}>
            <Text alignContent={"start"} color={"white"} fontSize={"lg"}>
              $
              {totalSupply && bitcoinPrice
                ? (totalSupply * bitcoinPrice).toLocaleString()
                : 0}
            </Text>
          </Skeleton>
        </VStack>
      </VStack>
      {/* <ProtocolHistory /> */}
    </ProtocolSummaryStackLayout>
  );
}
