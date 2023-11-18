import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Button, Text } from "@chakra-ui/react";

interface ExpandButtonProps {
  isExpanded: boolean;
  handleClick: () => void;
}

export function ExpandButton({
  isExpanded,
  handleClick,
}: ExpandButtonProps): React.JSX.Element {
  return (
    <Button variant={"vault"} w={"85px"} onClick={() => handleClick()}>
      <Text color={"white"} fontSize={"sm"}>
        {isExpanded ? "Less" : "More"}
      </Text>
      {isExpanded ? (
        <ChevronUpIcon color={"white"} boxSize={"25px"} />
      ) : (
        <ChevronDownIcon color={"white"} boxSize={"25px"} />
      )}
    </Button>
  );
}
