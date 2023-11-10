import { Box, VStack } from "@chakra-ui/react";
import { HasChildren } from "@models/has-children";

export function ProtocolHistoryLayout({
  children,
}: HasChildren): React.JSX.Element {
  return (
    <VStack h={"250px"}>
      <Box
        position="relative"
        h="185px"
        _after={{
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50px",
          backgroundImage:
            "linear-gradient(to top, background.04, transparent)",
        }}
      >
        <VStack alignItems={"start"} h={"175px"} spacing={"25px"} w={"50%"}>
          {children}
        </VStack>
      </Box>
    </VStack>
  );
}
