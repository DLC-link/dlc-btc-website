import { VStack } from "@chakra-ui/react";
import { HasChildren } from "@models/has-children";

export function UnmintLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack
      alignContent={"start"}
      pt={"50px"}
      h={"100%"}
      w={"100%"}
      spacing={"15px"}
    >
      {children}
    </VStack>
  );
}
