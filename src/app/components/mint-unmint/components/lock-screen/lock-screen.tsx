import { useContext, useState } from "react";

import { Button, VStack } from "@chakra-ui/react";
import { VaultCard } from "@components/vault/vault-card";
import { useVaults } from "@hooks/use-vaults";

import { BlockchainContext } from "../../../../providers/blockchain-context-provider";
import { LockScreenProtocolFee } from "./components/protocol-fee";
import { Vault } from "@models/vault";

interface LockScreenProps {
  currentStep: [number, string];
}


export function LockScreen({ currentStep }: LockScreenProps): React.JSX.Element {
  const { readyVaults } = useVaults();
  const blockchainContext = useContext(BlockchainContext);
  const bitcoin = blockchainContext?.bitcoin;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentVault = readyVaults.find((vault) => vault.uuid === currentStep[1]);

  async function handleClick(currentVault?: Vault) {
    if (!currentVault) return;
  
    try {
      setIsSubmitting(true);
      await bitcoin?.fetchBitcoinContractOfferAndSendToUserWallet(
        currentVault,
      );
    } catch (error) {
      setIsSubmitting(false);
      throw new Error("Error locking vault");
    }
  }

  return (
    <VStack w={"300px"} spacing={"15px"}>
      <VaultCard vault={currentVault} isSelected />
      <LockScreenProtocolFee
        assetAmount={currentVault?.collateral}
        bitcoinPrice={bitcoin?.bitcoinPrice}
      />
      <Button
        isLoading={isSubmitting}
        variant={"account"}
        onClick={() => handleClick(currentVault)}
      >
        Lock BTC
      </Button>
    </VStack>
  );
}
