import { VStack } from "@chakra-ui/react";
import { HasChildren } from "@models/has-children";

export function MintUnmintBoxLayout({
  children,
}: HasChildren): React.JSX.Element {
  return (
    <VStack
      px={"15px"}
      w={"650px"}
      h={"625px"}
      border={"1px solid"}
      borderRadius={"md"}
      borderColor={"secondary.01"}
      backgroundColor={"background.04"}
    >
      {children}
    </VStack>
  );
}
