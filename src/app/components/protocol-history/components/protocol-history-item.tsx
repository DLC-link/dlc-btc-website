import { HStack, Image, Text } from "@chakra-ui/react";
import { CustomSkeleton } from "@components/custom-skeleton/custom-skeleton";

interface ProtocolHistoryItem {
  id: string;
  value: string;
  uuid: string;
  date: string;
}

export function ProtocolHistoryItem(
  protocolHistoryItem: ProtocolHistoryItem,
): React.JSX.Element {
  if (!protocolHistoryItem) return <CustomSkeleton height={"35px"} />;

  return (
    <HStack
      justifyContent={"space-between"}
      p={"10px"}
      w={"300px"}
      h={"35px"}
      bgGradient={"linear(to-r, background.content.01, background.content.02)"}
      blendMode={"screen"}
      border={"1px solid"}
      borderRadius={"md"}
      borderColor={"border.white.01"}
    >
      <HStack spacing={"15px"}>
        <Image
          src={"/images/logos/dlc-btc-logo.svg"}
          alt={"dlcBTC Logo"}
          boxSize={"20px"}
        />
        <Text color={"white"} fontWeight={800}>
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
  );
}
