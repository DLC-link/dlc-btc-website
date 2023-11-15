import { HStack } from "@chakra-ui/react";
import { HasChildren } from "@models/has-children";

export function ProtocolSummaryStackLayout({
  children,
}: HasChildren): React.JSX.Element {
  return (
    <HStack
      py={"25px"}
      alignContent={"start"}
      h={"auto"}
      w={"100%"}
      spacing={"25px"}
    >
      {children}
    </HStack>
  );
}
