import { Button, VStack } from "@chakra-ui/react";
import { VaultCard } from "@components/vault/vault-card";
import { useVaults } from "@hooks/use-vaults";

import { LockScreenProtocolFee } from "./components/protocol-fee";
import { useContext } from "react";
import { BlockchainContext } from "../../../../providers/blockchain-context-provider";

export function LockScreen(): React.JSX.Element {
  const { readyVaults } = useVaults();
  const blockchainContext = useContext(BlockchainContext);
  const bitcoin = blockchainContext?.bitcoin;

  return (
    <VStack w={"300px"} spacing={"15px"}>
      <VaultCard vault={readyVaults[0]} isSelected />
      <LockScreenProtocolFee assetAmount={readyVaults[0].collateral} />
      <Button
        variant={"account"}
        onClick={() =>
          bitcoin?.fetchBitcoinContractOfferAndSendToUserWallet(readyVaults[0])
        }
      >
        Lock BTC
      </Button>
    </VStack>
  );
}
