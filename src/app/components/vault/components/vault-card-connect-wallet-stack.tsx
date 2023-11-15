import { Button, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { VaultStatus } from "@models/vault";

import { VaultCardButton } from "./vault-card-button";

const useIcon = (state: VaultStatus) => {
  return [VaultStatus.FUNDED, VaultStatus.CLOSING, VaultStatus.CLOSED].includes(
    state,
  )
    ? "/images/logos/dlc-btc-logo.svg"
    : "/images/logos/bitcoin-logo.svg";
};

interface VaultCardInformationStackProps {
  collateral: number;
  state: VaultStatus;
  isExpanded: boolean;
  handleClick: () => void;
}

export function VaultCardInformationStack({
  state,
  collateral,
  isExpanded,
  handleClick,
}: VaultCardInformationStackProps): React.JSX.Element {
  return (
    <HStack justifyContent={"space-between"} w={"100%"} h={"50px"}>
      <VStack alignItems={"start"} spacing={"0.5"} h={"45px"}>
        <HStack spacing={"15px"} h={"21.25px"}>
          <Image src={useIcon(state)} alt={"Icon"} boxSize={"20px"} />
          <Text color={"white"} fontWeight={"extrabold"}>
            {collateral} BTC
          </Text>
        </HStack>
        <Text px={"35px"} py={"0px"} color={"white.02"} fontSize={"xs"}>
          10/10/2023
        </Text>
      </VStack>
      {state === VaultStatus.READY ? (
        <Button variant={"action"} w={"85px"}>
          Lock BTC
        </Button>
      ) : (
        <VaultCardButton
          isExpanded={isExpanded}
          handleClick={() => handleClick()}
        />
      )}
    </HStack>
  );
}
