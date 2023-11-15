import { useSelector } from "react-redux";

import { HStack } from "@chakra-ui/react";
import { VaultGroupBlankContainer } from "@components/vaults-list/components/vault-group-blank-container";
import { VaultGroupContainer } from "@components/vaults-list/components/vault-group-container";
import { VaultsList } from "@components/vaults-list/vaults-list";
import { useVaults } from "@hooks/use-vaults";
import { RootState } from "@store/index";

import { DisconnectedInfoStack } from "./components/disconnected-info-stack";
import { MyVaultsLargeHeader } from "./components/my-vaults-large-header/my-vaults-large-header";
import { MyVaultsLargeLayout } from "./components/my-vaults-large.layout";

export function MyVaultsLarge(): React.JSX.Element {
  const { address, dlcBTCBalance, lockedBTCBalance } = useSelector(
    (state: RootState) => state.account,
  );
  const {
    readyVaults,
    fundingVaults,
    fundedVaults,
    closingVaults,
    closedVaults,
  } = useVaults();

  return (
    <MyVaultsLargeLayout>
      <MyVaultsLargeHeader
        address={address}
        dlcBTCBalance={dlcBTCBalance}
        lockedBTCBalance={lockedBTCBalance}
      />
      <HStack spacing={"35px"} w={"100%"}>
        {address ? (
          <VaultsList
            title={"In Process"}
            height={"475px"}
            isScrollable={!address}
          >
            <VaultGroupContainer label="Lock BTC" vaults={readyVaults} />
            <VaultGroupContainer
              label="Locking BTC in Progress"
              vaults={fundingVaults}
            />
            <VaultGroupContainer
              label="Unlocking BTC in Progress"
              vaults={closingVaults}
            />
          </VaultsList>
        ) : (
          <DisconnectedInfoStack />
        )}
        <VaultsList
          title={"Minted dlcBTC"}
          height={"475px"}
          isScrollable={!address}
        >
          {address ? (
            <VaultGroupContainer vaults={fundedVaults} />
          ) : (
            <VaultGroupBlankContainer />
          )}
        </VaultsList>
        <VaultsList
          title={"Closed Vaults"}
          height={"475px"}
          isScrollable={!address}
        >
          {address ? (
            <VaultGroupContainer vaults={closedVaults} />
          ) : (
            <VaultGroupBlankContainer />
          )}
        </VaultsList>
      </HStack>
    </MyVaultsLargeLayout>
  );
}
