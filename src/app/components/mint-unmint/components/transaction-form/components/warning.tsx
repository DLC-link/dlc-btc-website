import { HStack, Link, Text } from "@chakra-ui/react";

interface WarningProps {
  blockchain: "ethereum" | "bitcoin";
}

export function Warning({
  blockchain,
}: WarningProps): React.JSX.Element | boolean {
  if (blockchain === "bitcoin") return false;
  return (
    <HStack p={"15px"} bgColor={"white.03"} borderRadius={"md"}>
      <Text color={"white.01"} fontSize={"sm"}>
        <span style={{ fontWeight: 800 }}>
          Make sure you have 10.00 BTC + (fees){" "}
        </span>
        in your{" "}
        <Link
          isExternal
          href={"https://leather.io/"}
          color={"accent.orange.01"}
          textDecoration={"underline"}
        >
          Leather Wallet
        </Link>{" "}
        before proceeding to the next step.
      </Text>
    </HStack>
  );
}
