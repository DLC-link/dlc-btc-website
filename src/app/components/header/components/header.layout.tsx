import { HStack } from "@chakra-ui/react";

import { HasChildren } from "@models/has-children";

export function HeaderLayout({ children }: HasChildren): React.JSX.Element {
  return (
    <HStack px={["5%", "15%"]} justifyContent={"space-between"}>
      {children}
    </HStack>
  );
}
