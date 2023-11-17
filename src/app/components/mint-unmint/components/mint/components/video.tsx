import { useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

import { Stack, Text, VStack } from "@chakra-ui/react";
import { CustomSkeleton } from "@components/custom-skeleton/custom-skeleton";

export function TutorialVideo(): React.JSX.Element {
  const [loading, setLoading] = useState(true);
  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    event.target.pauseVideo();
    setLoading(false);
  };

  const opts: YouTubeProps["opts"] = {
    height: "150",
    width: "250",
    playerVars: {
      autoplay: 0,
      controls: 1,
    },
  };

  return (
    <VStack alignItems={"start"}>
      <Text color={"accent.cyan.01"} fontSize={"lg"}>
        Watch explainer video:
      </Text>
      <Stack
        border={"2.5px solid"}
        borderColor={"border.white.01"}
        borderRadius={"lg"}
      >
        <CustomSkeleton isLoaded={!loading}>
          <YouTube videoId="x9D1owU1tB8" opts={opts} onReady={onPlayerReady} />
        </CustomSkeleton>
      </Stack>
    </VStack>
  );
}
