import { Text, VStack } from "@chakra-ui/react";

export function VaultCardBlank(): React.JSX.Element {
  return (
    <VStack
      justifyContent={"center"}
      h={"65px"}
      w={"100%"}
      spacing={"15px"}
      bgColor={"white.03"}
      borderColor={"border.white.01"}
      borderRadius={"md"}
    >
      <Text color={"white.03"} fontSize={"sm"} fontWeight={800}>
        Connect Your Ethereum Wallet
      </Text>
    </VStack>
  );
}
