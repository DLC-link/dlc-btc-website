import { HStack, Image, Text, VStack } from "@chakra-ui/react";
import { VaultStatus } from "@models/vault";

import { VaultBoxExpandButton } from "./vault-box-expand-button";

const useIcon = (state: VaultStatus) => {
  return [VaultStatus.FUNDED, VaultStatus.CLOSING, VaultStatus.CLOSED].includes(
    state,
  )
    ? "/images/logos/dlc-btc-logo.svg"
    : "/images/logos/bitcoin-logo.svg";
};

interface VaultBoxInformationStackProps {
  collateral: number;
  state: VaultStatus;
  isExpanded: boolean;
  handleClick: () => void;
}

export function VaultBoxInformationStack({
  state,
  collateral,
  isExpanded,
  handleClick,
}: VaultBoxInformationStackProps): React.JSX.Element {
  return (
    <HStack justifyContent={"space-between"} w={"100%"}>
      <VStack alignItems={"start"} spacing={"1.5"} h={"45px"}>
        <HStack spacing={"15px"} h={"21.25px"}>
          <Image src={useIcon(state)} alt={"Icon"} boxSize={"20px"} />
          <Text color={"white"} fontWeight={"extrabold"}>
            {collateral} BTC
          </Text>
        </HStack>
        <Text px={"35px"} py={"0px"} color={"white.02"} fontSize={"sm"}>
          10/10/2023
        </Text>
      </VStack>
      <VaultBoxExpandButton
        isExpanded={isExpanded}
        handleClick={() => handleClick()}
      />
    </HStack>
  );
}
