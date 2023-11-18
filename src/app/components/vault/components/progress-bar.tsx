import { Box, Progress, Text, VStack } from "@chakra-ui/react";
import { VaultStatus } from "@models/vault";

interface ProgressBarProps {
  state: VaultStatus;
  confirmedBlocks: number;
}

export function ProgressBar({
  state,
  confirmedBlocks,
}: ProgressBarProps): React.JSX.Element | boolean {
  if (state !== VaultStatus.FUNDING && state !== VaultStatus.CLOSING)
    return false;

  return (
    <VStack w={"100%"} alignItems={"end"} position="relative">
      <Progress value={50} w={"100%"} h={"25px"} borderRadius={"md"} />
      <Box
        display="flex"
        position="absolute"
        alignItems="center"
        justifyContent="center"
        top="0"
        left="0"
        w="100%"
        h="100%"
      >
        <Text color={"white"} fontSize={"xs"} fontWeight={800}>
          WAITING FOR CONFIRMATIONS: {confirmedBlocks}/6
        </Text>
      </Box>
    </VStack>
  );
}
