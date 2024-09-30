import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { VStack, useBreakpointValue } from '@chakra-ui/react';
import { useActiveTabs } from '@hooks/use-active-tabs';
import { useAccount } from 'wagmi';

import { Banner } from './components/banner';
import DesktopHeader from './components/desktop-header';
import MobileHeader from './components/mobile-header';

export function Header(): React.JSX.Element {
  const navigate = useNavigate();
  const { chain, isConnected } = useAccount();

  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isNetworkMenuOpen, setIsNetworkMenuOpen] = useState<boolean>(false);
  const { isActiveTabs } = useActiveTabs();

  const handleTabClick = (route: string) => {
    navigate(route);
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (isConnected && !chain) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain]);

  return (
    <VStack>
      {showBanner && (
        <Banner
          handleButtonClick={() => {
            setIsNetworkMenuOpen(true);
          }}
        />
      )}
      {isMobile ? (
        <MobileHeader
          isNetworkMenuOpen={isNetworkMenuOpen}
          setIsNetworkMenuOpen={setIsNetworkMenuOpen}
          isActiveTabs={isActiveTabs}
        />
      ) : (
        <DesktopHeader
          isNetworkMenuOpen={isNetworkMenuOpen}
          setIsNetworkMenuOpen={setIsNetworkMenuOpen}
          handleTabClick={handleTabClick}
        />
      )}
    </VStack>
  );
}
