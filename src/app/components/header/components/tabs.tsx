import { HStack } from '@chakra-ui/react';
import { TabButton } from '@components/tab-button/tab-button';

interface NavigationTabsProps {
  activeTab: string;
  handleTabClick: (route: string) => void;
}

export function NavigationTabs({
  activeTab,
  handleTabClick,
}: NavigationTabsProps): React.JSX.Element {
  return (
    <HStack spacing={'25px'} marginRight={'150px'}>
      <TabButton
        title={'Mint/Unmint dlcBTC'}
        isActive={activeTab === '/'}
        handleClick={() => handleTabClick('/')}
      />
      <TabButton
        title={'My Vaults'}
        isActive={activeTab === '/my-vaults'}
        handleClick={() => handleTabClick('/my-vaults')}
      />
      {/* <TabButton
        title={'How It Works'}
        isActive={activeTab === '/how-it-works'}
        handleClick={() => handleTabClick('/how-it-works')}
      /> */}
    </HStack>
  );
}
