import { useContext, useState } from "react";

import { Button, VStack } from "@chakra-ui/react";
import { VaultCard } from "@components/vault/vault-card";
import { useVaults } from "@hooks/use-vaults";

import { BlockchainContext } from "../../../../providers/blockchain-context-provider";
import { LockScreenProtocolFee } from "./components/protocol-fee";

export function LockScreen(): React.JSX.Element {
  const { readyVaults } = useVaults();
  const blockchainContext = useContext(BlockchainContext);
  const bitcoin = blockchainContext?.bitcoin;
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <VStack w={"300px"} spacing={"15px"}>
      <VaultCard vault={readyVaults[0]} isSelected />
      <LockScreenProtocolFee
        assetAmount={readyVaults[0].collateral}
        bitcoinPrice={bitcoin?.bitcoinPrice}
      />
      <Button
        isLoading={isSubmitting}
        variant={"account"}
        onClick={async () => {
          try {
            setIsSubmitting(true);
            await bitcoin?.fetchBitcoinContractOfferAndSendToUserWallet(
              readyVaults[0],
            );
          } catch (error) {
            setIsSubmitting(false);
            throw new Error("Error locking vault");
          }
        }}
      >
        Lock BTC
      </Button>
    </VStack>
  );
}
