import { Text, VStack } from "@chakra-ui/react";
import { FadeLayer } from "@components/fade-layer/fade-layer";

import { scrollBarCSS } from "../../../styles/css-styles";

interface VaultsListProps {
  title?: string;
  height: string;
  isScrollable?: boolean;
  children: React.ReactNode;
}

export function VaultsList({
  title,
  height,
  isScrollable,
  children,
}: VaultsListProps): React.JSX.Element {
  return (
    <FadeLayer height={height} fadeHeight={"35px"}>
      <Text py={"15px"} color={"white"} fontWeight={"bold"}>
        {title}
      </Text>
      <VStack
        overflowY={isScrollable ? "hidden" : "scroll"}
        overflowX={"hidden"}
        alignItems={"start"}
        pr={isScrollable ? "0px" : "15px"}
        pb={"15px"}
        w={"100%"}
        css={scrollBarCSS}
      >
        {children}
      </VStack>
    </FadeLayer>
  );
}
