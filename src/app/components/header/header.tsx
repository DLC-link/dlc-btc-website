import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { HamburgerIcon } from '@chakra-ui/icons';
import {
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Account } from '@components/account/account';
import { CompanyWebsiteButton } from '@components/company-website-button/company-website-button';
import { HeaderLayout } from '@components/header/components/header.layout';
import { NetworkBox } from '@components/network/network';
import { useActiveTabs } from '@hooks/use-active-tabs';
import { useAccount } from 'wagmi';

import { Banner } from './components/banner';
import { NavigationTabs } from './components/tabs';

export function Header(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
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
      <HeaderLayout>
        <HStack
          justifyContent={isMobile ? 'space-between' : 'flex-start'}
          w={'100%'}
          gap={isMobile ? '0px' : '50px'}
        >
          <CompanyWebsiteButton />
          {isMobile ? (
            <HStack>
              <NetworkBox isMenuOpen={isNetworkMenuOpen} setIsMenuOpen={setIsNetworkMenuOpen} />
              <Account />
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  height={'40px'}
                  width={'40px'}
                />
                <MenuList>
                  <MenuItem onClick={() => navigate('/')}>Points</MenuItem>
                  <MenuItem onClick={() => navigate('/proof-of-reserve')}>
                    Proof of Reserve
                  </MenuItem>
                  {isActiveTabs && (
                    <>
                      <MenuItem onClick={() => navigate('/mint-withdraw')}>
                        Mint/Withdraw dlcBTC
                      </MenuItem>
                      <MenuItem onClick={() => navigate('/my-vaults')}>My Vaults</MenuItem>
                    </>
                  )}
                </MenuList>
              </Menu>
            </HStack>
          ) : (
            <NavigationTabs activeTab={location.pathname} handleTabClick={handleTabClick} />
          )}
        </HStack>
        <HStack>
          {!isMobile && (
            <>
              <NetworkBox isMenuOpen={isNetworkMenuOpen} setIsMenuOpen={setIsNetworkMenuOpen} />
              <Account />
            </>
          )}
        </HStack>
      </HeaderLayout>
    </VStack>
  );
}
