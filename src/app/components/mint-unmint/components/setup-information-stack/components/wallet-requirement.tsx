import { HStack, Image, Text, VStack } from "@chakra-ui/react";

interface WalletRequirementProps {
  logo: string;
  color: string;
  walletName: string;
  requirement: string;
}

export function WalletRequirement({
  logo,
  color,
  walletName,
  requirement,
}: WalletRequirementProps): React.JSX.Element {
  return (
    <VStack w={"100%"} spacing={"0.5px"}>
      <HStack alignContent={"start"} w={"100%"}>
        <Image src={logo} h={"15px"}></Image>
        <Text color={color} fontWeight={"regular"} textDecoration={"underline"}>
          {walletName}
        </Text>
      </HStack>
      <Text align={"start"} color={"white"} w={"100%"}>
        {requirement}
      </Text>
    </VStack>
  );
}
