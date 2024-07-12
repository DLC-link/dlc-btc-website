import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { HStack } from '@chakra-ui/react';
import { TabButton } from '@components/tab-button/tab-button';
import { useEthereum } from '@hooks/use-ethereum';
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
  const { isWhitelistingEnabled, isUserWhitelisted } = useEthereum();
  const [showDisplayMintBurn, setShowDisplayMintBurn] = useState<boolean>(false);

  useEffect(() => {
    async function checkWhitelisting(address?: string) {
      const result = async () => {
        if (!address) return false;
        return !(await isWhitelistingEnabled()) ? true : await isUserWhitelisted(address);
      };
      setShowDisplayMintBurn(await result());
    }
    void checkWhitelisting(address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

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

      {showDisplayMintBurn && (
        <TabButton
          title={'Mint/Withdraw dlcBTC'}
          isActive={activeTab === '/mint-withdraw'}
          handleClick={() => handleTabClick('/mint-withdraw')}
        />
      )}
      {showDisplayMintBurn && (
        <TabButton
          title={'My Vaults'}
          isActive={activeTab === '/my-vaults'}
          handleClick={() => handleTabClick('/my-vaults')}
        />
      )}
    </HStack>
  );
}
