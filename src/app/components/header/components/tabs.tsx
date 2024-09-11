import { useContext, useEffect, useState } from 'react';

import { HStack } from '@chakra-ui/react';
import { TabButton } from '@components/tab-button/tab-button';
import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { isUserWhitelisted, isWhitelistingEnabled } from 'dlc-btc-lib/ethereum-functions';
import { useAccount } from 'wagmi';

interface NavigationTabsProps {
  activeTab: string;
  handleTabClick: (route: string) => void;
}

export function NavigationTabs({
  activeTab,
  handleTabClick,
}: NavigationTabsProps): React.JSX.Element {
  const { address } = useAccount();
  const [showDisplayMintBurn, setShowDisplayMintBurn] = useState<boolean>(false);
  const { ethereumNetworkConfiguration, isEthereumNetworkConfigurationLoading } = useContext(
    EthereumNetworkConfigurationContext
  );

  useEffect(() => {
    async function checkWhitelisting(address?: string) {
      const result = async () => {
        if (!address || isEthereumNetworkConfigurationLoading) return false;

        const dlcManagerContract = ethereumNetworkConfiguration.dlcManagerContract;

        return (
          !(await isWhitelistingEnabled(dlcManagerContract)) ||
          (await isUserWhitelisted(dlcManagerContract, address))
        );
      };
      setShowDisplayMintBurn(await result());
    }

    void checkWhitelisting(address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, isEthereumNetworkConfigurationLoading]);

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
      {/* <TabButton
        title={'How It Works'}
        isActive={activeTab === '/how-it-works'}
        handleClick={() => handleTabClick('/how-it-works')}
      /> */}

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
