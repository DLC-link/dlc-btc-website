import React from 'react';

import { HStack } from '@chakra-ui/react';
import { Account } from '@components/account/account';
import { CompanyWebsiteButton } from '@components/company-website-button/company-website-button';
import { NetworkBox } from '@components/network/network';

import { HeaderLayout } from './header.layout';
import { NavigationTabs } from './tabs';

interface DesktopHeaderProps {
  isNetworkMenuOpen: boolean;
  setIsNetworkMenuOpen: (isOpen: boolean) => void;
  handleTabClick: (route: string) => void;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  isNetworkMenuOpen,
  setIsNetworkMenuOpen,
  handleTabClick,
}) => {
  return (
    <HeaderLayout>
      <HStack justifyContent={'flex-start'} w={'100%'} gap={'50px'}>
        <CompanyWebsiteButton />
        <NavigationTabs activeTab={location.pathname} handleTabClick={handleTabClick} />
      </HStack>
      <HStack>
        <>
          <NetworkBox isMenuOpen={isNetworkMenuOpen} setIsMenuOpen={setIsNetworkMenuOpen} />
          <Account />
        </>
      </HStack>
    </HeaderLayout>
  );
};

export default DesktopHeader;
