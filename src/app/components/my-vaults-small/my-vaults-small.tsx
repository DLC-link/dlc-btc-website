import { useNavigate } from "react-router-dom";

import { Button } from "@chakra-ui/react";
import { VaultsListGroupBlankContainer } from "@components/vaults-list/components/vaults-list-group-blank-container";
import { VaultsList } from "@components/vaults-list/vaults-list";
import { useVaults } from "@hooks/use-vaults";

import { VaultsListGroupContainer } from "../vaults-list/components/vaults-list-group-container";
import { MyVaultsSmallLayout } from "./components/my-vaults-small.layout";
import { useContext, useEffect, useState } from "react";
import { BlockchainContext } from "../../providers/blockchain-context-provider";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";

interface MyVaultsSmallProps {
  address?: string;
}

export function MyVaultsSmall({
  address,
}: MyVaultsSmallProps): React.JSX.Element {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const { network } = useSelector((state: RootState) => state.account);
  const blockchainContext = useContext(BlockchainContext);
  const ethereum = blockchainContext?.ethereum;
  const {
    readyVaults,
    fundingVaults,
    fundedVaults,
    closingVaults,
    closedVaults,
  } = useVaults();

  useEffect(() => {
    if (network && ethereum?.isLoaded) {
      const fetchAddressData = async () => {
        await ethereum?.getAllVaults();
        await ethereum?.getDLCBTCBalance();
        await ethereum?.getLockedBTCBalance();
        setIsLoaded(true);
      };
      fetchAddressData();
    }
  }, [network, ethereum?.isLoaded]);

  return (
    <MyVaultsSmallLayout>
      <VaultsList title={"My Vaults"} height={"545px"} isScrollable={!address}>
        {address && isLoaded ? (
          <>
            <VaultsListGroupContainer label="Lock BTC" vaults={readyVaults} />
            <VaultsListGroupContainer
              label="Locking BTC in Progress"
              vaults={fundingVaults}
            />
            <VaultsListGroupContainer
              label="Unlocking BTC in Progress"
              vaults={closingVaults}
            />
            <VaultsListGroupContainer
              label="Minted dlcBTC"
              vaults={fundedVaults}
            />
            <VaultsListGroupContainer
              label="Closed Vaults"
              vaults={closedVaults}
            />
          </>
        ) : (
          <VaultsListGroupBlankContainer />
        )}
      </VaultsList>
      <Button variant={"navigate"} onClick={() => navigate("/my-vaults")}>
        Show All
      </Button>
    </MyVaultsSmallLayout>
  );
}
