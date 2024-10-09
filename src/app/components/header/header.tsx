import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { HStack, VStack } from '@chakra-ui/react';
import { Account } from '@components/account/account';
import { CompanyWebsiteButton } from '@components/company-website-button/company-website-button';
import { HeaderLayout } from '@components/header/components/header.layout';
import { NetworkBox } from '@components/network/network';
import { useNetworkConnection } from '@hooks/use-connected';
import { NetworkConfigurationContext } from '@providers/network-configuration.provider';
import { useAccount } from 'wagmi';

import { Banner } from './components/banner';
import { NavigationTabs } from './components/tabs';

export function Header(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { isConnected } = useNetworkConnection();

  const { networkType } = useContext(NetworkConfigurationContext);
  const { chain: ethereumNetwork } = useAccount();

  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isNetworkMenuOpen, setIsNetworkMenuOpen] = useState<boolean>(false);

  const handleTabClick = (route: string) => {
    navigate(route);
  };

  useEffect(() => {
    if (networkType === 'evm' && isConnected && !ethereumNetwork) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, ethereumNetwork]);

  return (
    <VStack>
      {showBanner && (
        <Banner
          handleButtonClick={() => {
            setIsNetworkMenuOpen(true);
          }}
        />
      )}
      <HeaderLayout>
        <HStack gap={'50px'}>
          <CompanyWebsiteButton />
          <NavigationTabs activeTab={location.pathname} handleTabClick={handleTabClick} />
        </HStack>
        <HStack>
          <NetworkBox isMenuOpen={isNetworkMenuOpen} setIsMenuOpen={setIsNetworkMenuOpen} />
          <Account />
        </HStack>
      </HeaderLayout>
    </VStack>
  );
}
