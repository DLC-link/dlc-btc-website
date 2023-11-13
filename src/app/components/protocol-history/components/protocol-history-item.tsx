import { HStack, Image, Text } from "@chakra-ui/react";
import { CustomSkeleton } from "@components/custom-skeleton/custom-skeleton";
import { useLoadingDelay } from "@hooks/use-loading-delay";

interface ProtocolHistoryItem {
  id: string;
  value: string;
  uuid: string;
  date: string;
}

export function ProtocolHistoryItem(
  protocolHistoryItem: ProtocolHistoryItem,
): React.JSX.Element {
  const isLoaded = useLoadingDelay(3000);

  return (
    <CustomSkeleton isLoaded={isLoaded}>
      <HStack
        justifyContent={"space-between"}
        p={"10px"}
        w={"300px"}
        h={"35px"}
        bgGradient={"linear(to-r, background.04, background.05)"}
        blendMode={"screen"}
        border={"1px solid"}
        borderRadius={"md"}
        borderColor={"white.04"}
      >
        <HStack spacing={"15px"}>
          <Image
            src={"/images/logos/dlc-btc-logo.svg"}
            alt={"dlcBTC Logo"}
            boxSize={"25px"}
          />
          <Text color={"white"} fontWeight={"extrabold"}>
            {protocolHistoryItem.value}
          </Text>
          <Text color={"white"} fontSize={"sm"}>
            {protocolHistoryItem.uuid}
          </Text>
        </HStack>
        <Text color={"white"} fontSize={"sm"}>
          {protocolHistoryItem.date}
        </Text>
      </HStack>
    </CustomSkeleton>
  );
}
