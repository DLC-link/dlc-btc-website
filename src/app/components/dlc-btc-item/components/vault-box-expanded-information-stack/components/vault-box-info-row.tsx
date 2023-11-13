import { HStack, Text } from "@chakra-ui/react";

interface InfoRowProps {
  label: string;
  value: string;
}

export function InfoRow({ label, value }: InfoRowProps): React.JSX.Element {
  return (
    <HStack pl={"35px"} w={"100%"} alignItems={"start"} spacing={"15px"}>
      <Text w={"50%"} color={"white"} fontSize={"xs"}>
        {label}
      </Text>
      <Text textAlign={"right"} w={"50%"} color={"white"} fontSize={"xs"}>
        {value}
      </Text>
    </HStack>
  );
}
