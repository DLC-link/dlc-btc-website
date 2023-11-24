import { Button } from "@chakra-ui/react";

interface StepButtonProps {
  handleClick: () => void;
}

export function StepButton({
  handleClick,
}: StepButtonProps): React.JSX.Element {
  return (
    <Button
      variant={"vault"}
      h={"5px"}
      w={"85px"}
      borderColor={"white.03"}
      borderRadius={"full"}
      fontSize={"xs"}
      onClick={() => handleClick()}
    >
      Restart Flow
    </Button>
  );
}
