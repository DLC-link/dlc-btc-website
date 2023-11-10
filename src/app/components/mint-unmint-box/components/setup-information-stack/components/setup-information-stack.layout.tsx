import { VStack } from "@chakra-ui/react";
import { HasChildren } from "@models/has-children";

export function SetupInformationStackLayout({
  children,
}: HasChildren): React.JSX.Element {
  return (
    <VStack
      alignContent={"start"}
      py={"50px"}
      h={"auto"}
      w={"100%"}
      spacing={"25px"}
      borderBottom={"3.5px solid grey"}
    >
      {children}
    </VStack>
  );
}
