import React, { useContext, useEffect, useState } from 'react';

import { LandingPage } from '@components/mint-unmint/components/landing-page/landing-page';
import { MintUnmint } from '@components/mint-unmint/mint-unmint';
import { MyVaultsSmall } from '@components/my-vaults-small/my-vaults-small';
import { PageLayout } from '@pages/components/page.layout';
import { NetworkConfigurationContext } from '@providers/network-configuration.provider';
import { RippleNetworkConfigurationContext } from '@providers/ripple-network-configuration.provider';
import { useAccount } from 'wagmi';

export function Dashboard(): React.JSX.Element {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const { address, connector, isConnected: isEthereumWalletConnected } = useAccount();
  const { isRippleWalletConnected, setIsRippleWalletConnected } = useContext(
    RippleNetworkConfigurationContext
  );
  const { networkType } = useContext(NetworkConfigurationContext);
  useEffect(() => {
    console.log('changing network type', networkType);
    if (networkType === 'evm') {
      setIsConnected(isEthereumWalletConnected);
    } else {
      console.log('connected', isRippleWalletConnected);
      setIsConnected(isRippleWalletConnected);
    }
  }, [isEthereumWalletConnected, isRippleWalletConnected, networkType]);

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
