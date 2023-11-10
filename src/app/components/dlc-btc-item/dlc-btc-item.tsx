import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  HStack,
  Image,
  Progress,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useLoadingDelay } from "@hooks/use-loading-delay";

import { DlcBtcItemLayout } from "./components/dlc-btc-item.layout";

export function DlcBtcItem(): React.JSX.Element {
  const isLoaded = useLoadingDelay(3000);

  return (
    <DlcBtcItemLayout isLoaded={isLoaded}>
      <VStack w={"100%"} spacing={"25px"}>
        <HStack justifyContent={"space-between"} w={"100%"}>
          <VStack alignItems={"start"} spacing={"1.5"} h={"45px"}>
            <HStack spacing={"15px"} h={"21.25px"}>
              <Image
                src={"/images/logos/bitcoin-logo.svg"}
                alt={"BTC Logo"}
                boxSize={"20px"}
              />
              <Text color={"white"} fontWeight={"extrabold"}>
                5.5
              </Text>
            </HStack>
            <Text px={"35px"} py={"0px"} color={"white"} fontSize={"sm"}>
              10/10/2023
            </Text>
          </VStack>
          <Button variant={"more"}>
            <Text color={"white"} fontSize={"sm"}>
              More
            </Text>
            <ChevronDownIcon color={"white"} boxSize={"25px"} />
          </Button>
        </HStack>
        <Progress
          value={75}
          w={"100%"}
          color={"white"}
          h={"15px"}
          borderRadius={"md"}
          hasStripe
        >
          WAITING FOR LOCK
        </Progress>
      </VStack>
    </DlcBtcItemLayout>
  );
}
