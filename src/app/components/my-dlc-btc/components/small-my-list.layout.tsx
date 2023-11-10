import { VStack } from "@chakra-ui/react";
import { HasChildren } from "@models/has-children";

export function SmallMyListLayout({
  children,
}: HasChildren): React.JSX.Element {
  return (
    <VStack
      alignItems={"start"}
      p={"15px"}
      w={"350px"}
      h={"625px"}
      spacing={"25px"}
      border={"1px solid"}
      borderRadius={"md"}
      borderColor={"secondary.01"}
      backgroundColor={"background.04"}
    >
      {children}
    </VStack>
  );
}
