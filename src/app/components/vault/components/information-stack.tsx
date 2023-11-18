import { Button, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { VaultStatus } from "@models/vault";

import { ExpandButton } from "./expand-button";

const useIcon = (state: VaultStatus) => {
  return [VaultStatus.FUNDED, VaultStatus.CLOSING, VaultStatus.CLOSED].includes(
    state,
  )
    ? "/images/logos/dlc-btc-logo.svg"
    : "/images/logos/bitcoin-logo.svg";
};

interface InformationStackProps {
  collateral: number;
  state: VaultStatus;
  isExpanded: boolean;
  handleClick: () => void;
}

export function InformationStack({
  state,
  collateral,
  isExpanded,
  handleClick,
}: InformationStackProps): React.JSX.Element {
  return (
    <HStack justifyContent={"space-between"} w={"100%"} h={"50px"}>
      <VStack alignItems={"start"} spacing={"0.5"} h={"45px"}>
        <HStack spacing={"15px"} h={"21.25px"}>
          <Image src={useIcon(state)} alt={"Icon"} boxSize={"25px"} />
          <Text color={"white"} fontWeight={800}>
            {collateral} BTC
          </Text>
        </HStack>
        <Text px={"40px"} py={"0px"} color={"white.02"} fontSize={"xs"}>
          10/10/2023
        </Text>
      </VStack>
      {state === VaultStatus.READY ? (
        <Button variant={"vault"} w={"85px"}>
          Lock BTC
        </Button>
      ) : (
        <ExpandButton
          isExpanded={isExpanded}
          handleClick={() => handleClick()}
        />
      )}
    </HStack>
  );
}
