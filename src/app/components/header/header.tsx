import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { HStack } from '@chakra-ui/react';
import { Account } from '@components/account/account';
import { CompanyWebsiteButton } from '@components/company-website-button/company-website-button';
import { HeaderLayout } from '@components/header/components/header.layout';

import { NavigationTabs } from './components/tabs';

export function Header(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (route: string) => {
    navigate(route);
  };

  return (
    <HeaderLayout>
      <HStack gap={'50px'}>
        <CompanyWebsiteButton />
        <NavigationTabs activeTab={location.pathname} handleTabClick={handleTabClick} />
      </HStack>
      <Account />
    </HeaderLayout>
  );
}
