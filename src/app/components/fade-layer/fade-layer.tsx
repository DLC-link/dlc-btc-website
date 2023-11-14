import { VStack } from "@chakra-ui/react";

interface FadeLayerProps {
  children: React.ReactNode;
  height: string;
  fadeHeight: string;
}

export function FadeLayer({
  children,
  height,
  fadeHeight,
}: FadeLayerProps): React.JSX.Element {
  const afterStyles = {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: fadeHeight,
    backgroundImage: "linear-gradient(to top, background.container.01, transparent)",
  };

  return (
    <VStack
      alignItems={"start"}
      position="relative"
      w={"100%"}
      h={height}
      _after={afterStyles}
    >
      {children}
    </VStack>
  );
}
