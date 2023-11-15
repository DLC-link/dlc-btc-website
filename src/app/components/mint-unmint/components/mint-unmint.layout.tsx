import { VStack } from "@chakra-ui/react";
import { HasChildren } from "@models/has-children";

export function MintUnmintLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack
      px={"15px"}
      w={"650px"}
      h={"625px"}
      bg={"background.container.01"}
      border={"1px solid"}
      borderRadius={"md"}
      borderColor={"border.cyan.01"}
    >
      {children}
    </VStack>
  );
}
