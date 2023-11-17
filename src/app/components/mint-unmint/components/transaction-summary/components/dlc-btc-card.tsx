import { HStack, Image, Text, VStack } from "@chakra-ui/react";

export function DlcBtcCard(): React.JSX.Element {
  return (
    <VStack
      justifyContent={"center"}
      alignItems={"start"}
      p={"7.5px"}
      h={"50px"}
      w={"100%"}
      bgGradient={"linear(to-r, background.content.01, background.content.02)"}
      blendMode={"screen"}
      border={"1px solid"}
      borderColor={"border.white.01"}
      borderRadius={"md"}
    >
      <HStack spacing={"15px"}>
        <Image
          src={"/images/logos/dlc-btc-logo.svg"}
          alt={"dlcBTC"}
          boxSize={"20px"}
        />
        <Text color={"white"} fontWeight={"extrabold"}>
          10.00 dlcBTC
        </Text>
      </HStack>
    </VStack>
  );
}
