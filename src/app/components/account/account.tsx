import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@chakra-ui/react";
import { AccountMenu } from "@components/account/components/account-menu";
import { Wallet, WalletType, ethereumWallets } from "@models/wallet";
import { RootState } from "@store/index";
import { accountActions } from "@store/slices/account/account.actions";
import { modalActions } from "@store/slices/modal/modal.actions";

function findWalletById(walletType: WalletType): Wallet | undefined {
  const wallet = ethereumWallets.find((wallet) => wallet.id === walletType);
  return wallet;
}

export function Account(): React.JSX.Element {
  const dispatch = useDispatch();
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
  const { address, walletType } = useSelector(
    (state: RootState) => state.account,
  );

  useEffect(() => {
    const currentWallet =
      walletType !== undefined && findWalletById(walletType);
    if (currentWallet) setWallet(currentWallet);
  }, [walletType]);

  function onConnectWalletClick(): void {
    dispatch(modalActions.toggleSelectWalletModalVisibility());
  }

  function onDisconnectWalletClick(): void {
    dispatch(accountActions.logout());
  }

  return (
    <>
      {address && wallet ? (
        <AccountMenu
          address={address}
          wallet={wallet}
          handleClick={() => onDisconnectWalletClick()}
        />
      ) : (
        <Button variant={"account"} onClick={() => onConnectWalletClick()}>
          CONNECT WALLET
        </Button>
      )}
    </>
  );
}
