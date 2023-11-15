import { useNavigate } from "react-router-dom";

import { Button } from "@chakra-ui/react";
import { VaultGroupBlankContainer } from "@components/vaults-list/components/vault-group-blank-container";
import { VaultsList } from "@components/vaults-list/vaults-list";
import { useVaults } from "@hooks/use-vaults";

import { VaultGroupContainer } from "../vaults-list/components/vault-group-container";
import { MyVaultsSmallLayout } from "./components/my-vaults-small.layout";

interface MyVaultsSmallProps {
  address?: string;
}

export function MyVaultsSmall({
  address,
}: MyVaultsSmallProps): React.JSX.Element {
  const navigate = useNavigate();
  const {
    readyVaults,
    fundingVaults,
    fundedVaults,
    closingVaults,
    closedVaults,
  } = useVaults();

  return (
    <MyVaultsSmallLayout>
      <VaultsList title={"My Vaults"} height={"525px"} isScrollable={!address}>
        {address ? (
          <>
            <VaultGroupContainer label="Lock BTC" vaults={readyVaults} />
            <VaultGroupContainer
              label="Locking BTC in Progress"
              vaults={fundingVaults}
            />
            <VaultGroupContainer
              label="Unlocking BTC in Progress"
              vaults={closingVaults}
            />
            <VaultGroupContainer label="Minted dlcBTC" vaults={fundedVaults} />
            <VaultGroupContainer label="Closed Vaults" vaults={closedVaults} />
          </>
        ) : (
          <VaultGroupBlankContainer />
        )}
      </VaultsList>
      <Button variant={"navigate"} onClick={() => navigate("/my-vaults")}>
        Show All
      </Button>
    </MyVaultsSmallLayout>
  );
}
