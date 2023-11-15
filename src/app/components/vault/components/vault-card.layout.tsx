import { ReactNode } from "react";

import { VStack } from "@chakra-ui/react";
import { CustomSkeleton } from "@components/custom-skeleton/custom-skeleton";

interface VaultCardLayoutProps {
  children: ReactNode;
  isLoaded: boolean;
}

export function VaultCardLayout({
  children,
  isLoaded,
}: VaultCardLayoutProps): React.JSX.Element {
  return (
    <CustomSkeleton isLoaded={isLoaded}>
      <VStack
        alignContent={"start"}
        p={"7.5px"}
        h={"auto"}
        w={"100%"}
        spacing={"15px"}
        bgGradient={
          "linear(to-r, background.content.01, background.content.02)"
        }
        blendMode={"screen"}
        border={"1px solid"}
        borderColor={"border.white.01"}
        borderRadius={"md"}
      >
        {children}
      </VStack>
    </CustomSkeleton>
  );
}
