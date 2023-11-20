import { Box, Progress, Text, VStack } from "@chakra-ui/react";

interface VaultProgressBarProps {
  confirmedBlocks: number;
}

export function VaultProgressBar({
  confirmedBlocks,
}: VaultProgressBarProps): React.JSX.Element {
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
