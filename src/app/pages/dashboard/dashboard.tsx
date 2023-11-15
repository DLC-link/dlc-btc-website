import React from "react";
import { useSelector } from "react-redux";

import { MintUnmint } from "@components/mint-unmint/mint-unmint";
import { MyVaultsSmall } from "@components/my-vaults-small/my-vaults-small";
import { PageLayout } from "@pages/components/page.layout";
import { RootState } from "@store/index";

export function Dashboard(): React.JSX.Element {
  const { address } = useSelector((state: RootState) => state.account);

  return (
    <PageLayout>
      <MintUnmint address={address} />
      <MyVaultsSmall address={address} />
    </PageLayout>
  );
}
