import { ReactNode } from "react";

import { Skeleton } from "@chakra-ui/react";

interface CustomSkeletonProps {
  children: ReactNode;
  isLoaded: boolean;
}

export function CustomSkeleton({
  children,
  isLoaded,
}: CustomSkeletonProps): React.JSX.Element {
  return (
    <Skeleton
      startColor={"white.02"}
      endColor={"white.03"}
      isLoaded={isLoaded}
      w={"100%"}
    >
      {children}
    </Skeleton>
  );
}
