import { useState } from "react";
import { useDispatch } from "react-redux";

import { ScaleFade, Text, VStack } from "@chakra-ui/react";
import { ModalComponentProps } from "@components/modals/components/modal-container";
import { ModalLayout } from "@components/modals/components/modal.layout";
import { WalletMenu } from "@components/modals/select-wallet-modal/components/wallet-button";
import { SelectNetworkButton } from "@components/select-network-button/select-network-button";
import { Network } from "@models/network";
import { WalletType, ethereumWallets } from "@models/wallet";
import { accountActions } from "@store/slices/account/account.actions";
import { AccountState } from "@store/slices/account/account.slice";

export function SelectWalletModal({
  isOpen,
  handleClose,
}: ModalComponentProps): React.JSX.Element {
  const dispatch = useDispatch();
  const [currentNetwork, setCurrentNetwork] = useState<Network | undefined>(
    undefined,
  );

  const handleLogin = (address: string, walletType: WalletType) => {
    dispatch(
      accountActions.login({
        address: address,
        walletType: walletType,
        network: currentNetwork?.id,
      } as AccountState),
    );
    setCurrentNetwork(undefined);
    handleClose();
  };

  const handleNetworkChange = (currentNetwork: Network) => {
    setCurrentNetwork(currentNetwork);
  };

  return (
    <ModalLayout
      title="Connect Wallet"
      isOpen={isOpen}
      onClose={() => handleClose()}
    >
      <VStack>
        <ScaleFade in={!currentNetwork} unmountOnExit>
          <Text variant={"header"}>Choose Network</Text>
        </ScaleFade>
        <SelectNetworkButton
          handleClick={handleNetworkChange}
          currentNetwork={currentNetwork}
        />
        <ScaleFade
          in={!!currentNetwork}
          transition={{ enter: { delay: 0.15 } }}
          unmountOnExit
        >
          <VStack>
            <Text variant={"header"}>Select Wallet</Text>
            {ethereumWallets.map((wallet) => (
              <WalletMenu
                key={wallet.name}
                wallet={wallet}
                handleClick={handleLogin}
              />
            ))}
          </VStack>
        </ScaleFade>
      </VStack>
    </ModalLayout>
  );
}
