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
      startColor="accent.01"
      endColor="accent.02"
      isLoaded={isLoaded}
      w={"100%"}
    >
      {children}
    </Skeleton>
  );
}
