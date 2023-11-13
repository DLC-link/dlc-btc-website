import { VStack } from "@chakra-ui/react";
import { HasChildren } from "@models/has-children";

export function VaultListLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <VStack
      py={"15px"}
      px={"25px"}
      w={"350px"}
      h={"625px"}
      bg={"background.03"}
      border={"1px solid"}
      borderRadius={"md"}
      borderColor={"accent.03"}
    >
      {children}
    </VStack>
  );
}
