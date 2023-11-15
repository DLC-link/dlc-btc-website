import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Button, Text } from "@chakra-ui/react";

interface VaultCardButtonProps {
  isExpanded: boolean;
  handleClick: () => void;
}

export function VaultCardButton({
  isExpanded,
  handleClick,
}: VaultCardButtonProps): React.JSX.Element {
  return (
    <Button variant={"action"} w={"85px"} onClick={() => handleClick()}>
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
