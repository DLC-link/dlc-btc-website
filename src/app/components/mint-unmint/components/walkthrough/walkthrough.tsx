import { ReactNode } from "react";

import { HStack, Text } from "@chakra-ui/react";

import { BlockchainTag } from "./components/blockchain-tag";
import { WalkthroughLayout } from "./components/walkthrough.layout";

interface WalkthroughProps {
  step: number;
  title: string;
  blockchain: "ethereum" | "bitcoin";
  primaryBody: ReactNode;
  secondaryBody?: ReactNode;
  button?: ReactNode;
  video?: ReactNode;
}

export function Walkthrough({
  step,
  title,
  blockchain,
  primaryBody,
  secondaryBody,
  button,
  video,
}: WalkthroughProps): React.JSX.Element {
  return (
    <WalkthroughLayout>
      <HStack>
        <Text color={"accent.cyan.01"} fontSize={"lg"}>
          Step {step + 1}
        </Text>
        <BlockchainTag blockchain={blockchain} />
      </HStack>
      <Text color={"white.01"} fontSize={"lg"} fontWeight={800}>
        {title}
      </Text>
      {primaryBody}
      {secondaryBody}
      {button}
      {video}
    </WalkthroughLayout>
  );
}
