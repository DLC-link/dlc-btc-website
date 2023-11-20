import { Skeleton } from "@chakra-ui/react";

interface CustomSkeletonProps {
  height: string;
}

export function CustomSkeleton({
  height,
}: CustomSkeletonProps): React.JSX.Element {
  return (
    <Skeleton
      startColor={"white.02"}
      endColor={"white.03"}
      w={"100%"}
      h={height}
    />
  );
}
