import { useSelector } from 'react-redux';

import { HStack } from '@chakra-ui/react';
import { TabButton } from '@components/tab-button/tab-button';
import { RootState } from '@store/index';

interface NavigationTabsProps {
  activeTab: string;
  handleTabClick: (route: string) => void;
}

export function NavigationTabs({
  activeTab,
  handleTabClick,
}: NavigationTabsProps): React.JSX.Element {
  const { address } = useSelector((state: RootState) => state.account);

  return (
    <HStack spacing={'25px'} marginRight={'150px'}>
      <TabButton
        title={'Points'}
        isActive={activeTab === '/'}
        handleClick={() => handleTabClick('/')}
      />
      <TabButton
        title={'Proof of Reserve'}
        isActive={activeTab === '/proof-of-reserve'}
        handleClick={() => handleTabClick('/proof-of-reserve')}
      />
      <TabButton
        title={'How It Works'}
        isActive={activeTab === '/how-it-works'}
        handleClick={() => handleTabClick('/how-it-works')}
      />

      {address && (
        <TabButton
          title={'Mint/Withdraw dlcBTC'}
          isActive={activeTab === '/mint-withdraw'}
          handleClick={() => handleTabClick('/mint-withdraw')}
        />
      )}
      {address && (
        <TabButton
          title={'My Vaults'}
          isActive={activeTab === '/my-vaults'}
          handleClick={() => handleTabClick('/my-vaults')}
        />
      )}
    </HStack>
  );
}
