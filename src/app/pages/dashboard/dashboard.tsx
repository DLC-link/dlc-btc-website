import React from 'react';

import { LandingPage } from '@components/mint-unmint/components/landing-page/landing-page';
import { MintUnmint } from '@components/mint-unmint/mint-unmint';
import { MyVaultsSmall } from '@components/my-vaults-small/my-vaults-small';
import { PageLayout } from '@pages/components/page.layout';
import { useAccount } from 'wagmi';

export function Dashboard(): React.JSX.Element {
  const { isConnected } = useAccount();

  return (
    <PageLayout>
      {isConnected ? (
        <>
          <MintUnmint />
          <MyVaultsSmall />
        </>
      ) : (
        <LandingPage />
      )}
    </PageLayout>
  );
}
