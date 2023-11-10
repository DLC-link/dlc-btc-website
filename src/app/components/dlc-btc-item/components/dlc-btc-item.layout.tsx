import { ReactNode } from "react";

import { HStack } from "@chakra-ui/react";
import { CustomSkeleton } from "@components/custom-skeleton/custom-skeleton";

interface DlcBtcItemLayoutProps {
  children: ReactNode;
  isLoaded: boolean;
}

export function DlcBtcItemLayout({
  children,
  isLoaded,
}: DlcBtcItemLayoutProps): React.JSX.Element {
  return (
    <CustomSkeleton isLoaded={isLoaded}>
      <HStack
        alignContent={"start"}
        p={"15px"}
        h={"auto"}
        w={"100%"}
        border={"1px solid"}
        borderColor={"secondary.01"}
        borderRadius={"md"}
      >
        {children}
      </HStack>
    </CustomSkeleton>
  );
}
