import React from 'react';

import { LandingPage } from '@components/mint-unmint/components/landing-page/landing-page';
import { MintUnmint } from '@components/mint-unmint/mint-unmint';
import { MyVaultsSmall } from '@components/my-vaults-small/my-vaults-small';
import { useNetworkConnection } from '@hooks/use-connected';
import { PageLayout } from '@pages/components/page.layout';

export function Dashboard(): React.JSX.Element {
  const { isConnected } = useNetworkConnection();

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
