import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { HStack } from "@chakra-ui/react";
import { VaultsListGroupBlankContainer } from "@components/vaults-list/components/vaults-list-group-blank-container";
import { VaultsListGroupContainer } from "@components/vaults-list/components/vaults-list-group-container";
import { VaultsList } from "@components/vaults-list/vaults-list";
import { RootState } from "@store/index";

import { BlockchainContext } from "../../providers/blockchain-context-provider";
import { VaultContext } from "../../providers/vault-context-provider";
import { MyVaultsLargeHeader } from "./components/my-vaults-header/my-vaults-header";
import { MyVaultsLargeLayout } from "./components/my-vaults-large.layout";
import { MyVaultsSetupInformationStack } from "./components/my-vaults-setup-information-stack";

export function MyVaultsLarge(): React.JSX.Element {
  const { address } = useSelector((state: RootState) => state.account);

  const blockchainContext = useContext(BlockchainContext);
  const ethereum = blockchainContext?.ethereum;
  const [dlcBTCBalance, setDLCBTCBalance] = useState<number | undefined>(
    undefined,
  );
  const [lockedBTCBalance, setLockedBTCBalance] = useState<number | undefined>(
    undefined,
  );

  const vaultContext = useContext(VaultContext);
  const {
    readyVaults,
    fundingVaults,
    fundedVaults,
    closingVaults,
    closedVaults,
  } = vaultContext.vaults;

  useEffect(() => {
    if (!ethereum || !address) return;

    const { getDLCBTCBalance, getLockedBTCBalance } = ethereum;
    const fetchData = async () => {
      const currentTokenBalance = await getDLCBTCBalance();
      if (currentTokenBalance !== dlcBTCBalance) {
        setDLCBTCBalance(currentTokenBalance);
      }
      const currentLockedBTCBalance = await getLockedBTCBalance();
      if (currentLockedBTCBalance !== lockedBTCBalance) {
        setLockedBTCBalance(currentLockedBTCBalance);
      }
    };
    fetchData();
  }, [address, vaultContext.vaults]);

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
            isScrollable={!!address}
          >
            <VaultsListGroupContainer label="Lock BTC" vaults={readyVaults} />
            <VaultsListGroupContainer
              label="Locking BTC in Progress"
              vaults={fundingVaults}
            />
            <VaultsListGroupContainer
              label="Unlocking BTC in Progress"
              vaults={closingVaults}
            />
          </VaultsList>
        ) : (
          <MyVaultsSetupInformationStack />
        )}
        <VaultsList
          title={"Minted dlcBTC"}
          height={"475px"}
          isScrollable={!!address}
        >
          {address ? (
            <VaultsListGroupContainer vaults={fundedVaults} />
          ) : (
            <VaultsListGroupBlankContainer />
          )}
        </VaultsList>
        <VaultsList
          title={"Closed Vaults"}
          height={"475px"}
          isScrollable={!!address}
        >
          {address ? (
            <VaultsListGroupContainer vaults={closedVaults} />
          ) : (
            <VaultsListGroupBlankContainer />
          )}
        </VaultsList>
      </HStack>
    </MyVaultsLargeLayout>
  );
}
