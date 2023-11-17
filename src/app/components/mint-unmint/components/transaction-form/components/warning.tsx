import { HStack, Link, Text } from "@chakra-ui/react";

export function Warning(): React.JSX.Element {
  return (
    <HStack bgColor={"white.03"} p={"15px"} borderRadius={"md"}>
      <Text color={"white.01"} fontSize={"sm"}>
        <span style={{ fontWeight: "bold" }}>
          Make sure you have 10.00 BTC + (fees){" "}
        </span>
        in your{" "}
        <Link
          color={"accent.cyan.01"}
          href="https://ethereum.org/"
          isExternal
          textDecoration={"underline"}
        >
          Leather Wallet{" "}
        </Link>
        before proceeding to the next step.
      </Text>
    </HStack>
  );
}
