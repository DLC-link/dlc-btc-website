import { Progress, Text, VStack } from "@chakra-ui/react";
import { VaultStatus } from "@models/vault";

interface VaultBoxProgressBarProps {
  state: VaultStatus;
  confirmedBlocks: number;
}

export function VaultBoxProgressBar({
  state,
  confirmedBlocks,
}: VaultBoxProgressBarProps): React.JSX.Element | boolean {
  if (state !== VaultStatus.FUNDING && state !== VaultStatus.CLOSING)
    return false;

  return (
    <VStack w={"100%"} alignItems={"end"}>
      <Progress
        value={75}
        w={"100%"}
        h={"15px"}
        color={"white"}
        borderRadius={"md"}
      />
      <Text color={"white"} fontSize={"2xs"}>
        Waiting for confirmations: {confirmedBlocks}/6
      </Text>
    </VStack>
  );
}
