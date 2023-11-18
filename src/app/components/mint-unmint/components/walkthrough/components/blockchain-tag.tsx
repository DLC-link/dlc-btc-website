import { HStack, Image, Text } from "@chakra-ui/react";

const blockchainTagPropertyMap = {
  ethereum: {
    logo: "/images/logos/ethereum-logo.svg",
    text: "ON ETHEREUM",
  },
  bitcoin: {
    logo: "/images/logos/bitcoin-logo.svg",
    text: "ON BITCOIN",
  },
};

interface BlockchainTagProps {
  blockchain: "ethereum" | "bitcoin";
}

export function BlockchainTag({
  blockchain,
}: BlockchainTagProps): React.JSX.Element {
  return (
    <HStack pr={"15px"} py={"0px"} bgColor={"white.03"} borderRadius={"xl"}>
      <Image
        src={blockchainTagPropertyMap[blockchain].logo}
        alt={"Ethereum"}
        boxSize={"15px"}
      />
      <Text color={"white.01"} fontSize={"2xs"} fontWeight={800}>
        {blockchainTagPropertyMap[blockchain].text}
      </Text>
    </HStack>
  );
}
