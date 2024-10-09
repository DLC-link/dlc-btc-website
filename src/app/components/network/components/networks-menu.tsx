import { useContext, useEffect, useState } from 'react';

import { HStack, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useNetworkConnection } from '@hooks/use-connected';
import { NetworkConfigurationContext } from '@providers/network-configuration.provider';
import { RippleNetworkConfigurationContext } from '@providers/ripple-network-configuration.provider';
import { useAccount, useConfig, useSwitchChain } from 'wagmi';

interface NetworksMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
}

export function NetworksMenu({
  isMenuOpen,
  setIsMenuOpen,
}: NetworksMenuProps): React.JSX.Element | null {
  const { chains } = useConfig();
  const { isConnected } = useNetworkConnection();
  const { chain: ethereumNetwork } = useAccount();

  const { networkType } = useContext(NetworkConfigurationContext);

  const { switchChain } = useSwitchChain();

  if (!isConnected || networkType === 'xrpl') {
    return null;
  }

  return (
    <Menu variant={'networkChange'} isOpen={isMenuOpen}>
      <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <HStack justifyContent={'space-evenly'}>
          <Text>{ethereumNetwork ? ethereumNetwork?.name : 'Not Connected'}</Text>
        </HStack>
      </MenuButton>
      <MenuList>
        {chains.map(ethereumNetwork => {
          return (
            <MenuItem
              key={ethereumNetwork.id}
              value={ethereumNetwork.id}
              onClick={() => {
                switchChain({ chainId: ethereumNetwork.id });
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              {ethereumNetwork.name}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}
