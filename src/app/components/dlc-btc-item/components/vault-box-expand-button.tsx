import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Button, Text } from "@chakra-ui/react";

interface VaultBoxExpandButtonProps {
  isExpanded: boolean;
  handleClick: () => void;
}

export function VaultBoxExpandButton({
  isExpanded,
  handleClick,
}: VaultBoxExpandButtonProps): React.JSX.Element {
  return (
    <Button variant={"action"} onClick={() => handleClick()} w={"85px"}>
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
