import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Button, Text } from "@chakra-ui/react";

interface VaultExpandButtonProps {
  isExpanded: boolean;
  handleClick: () => void;
}

export function VaultExpandButton({
  isExpanded,
  handleClick,
}: VaultExpandButtonProps): React.JSX.Element {
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
