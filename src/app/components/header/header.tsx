import React, { useState } from 'react';

import { HStack } from '@chakra-ui/react';

import { AccountButton } from '../account-button/account-button';
import { TabButton } from '../tab-button/tab-button';
import { CompanyWebsiteButton } from './components/company-website-button';
import { HeaderLayout } from './components/header.layout';
import { SelectNetworkButton } from '../select-network-button/select-network-button';
import { networks } from '../../../shared/models/network';

export function Header(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState('tab.a');

  const handleTabClick = (title: string) => {
    setActiveTab(title);
  };

  return (
    <HeaderLayout>
      <HStack width={'50%'} spacing={'7.5%'} alignItems={'flex-end'}>
        <CompanyWebsiteButton />
        <TabButton
          title={'Mint/Unmint dlcBTC'}
          isActive={activeTab === 'tab.a'}
          handleClick={() => handleTabClick('tab.a')}
        />
        <TabButton
          title={'How It Works'}
          isActive={activeTab === 'tab.b'}
          handleClick={() => handleTabClick('tab.b')}
        />
      </HStack>
      <SelectNetworkButton networks={networks}/>
      <AccountButton />
    </HeaderLayout>
  );
}
