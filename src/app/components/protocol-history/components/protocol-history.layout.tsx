import { VStack } from "@chakra-ui/react";
import { FadeLayer } from "@components/fade-layer/fade-layer";
import { HasChildren } from "@models/has-children";

export function ProtocolHistoryLayout({
  children,
}: HasChildren): React.JSX.Element {
  return (
    <VStack h={"250px"}>
      <FadeLayer height={"195px"} fadeHeight={"25px"}>
        <VStack alignItems={"start"} h={"195px"} spacing={"15px"} w={"50%"}>
          {children}
        </VStack>
      </FadeLayer>
    </VStack>
  );
}
