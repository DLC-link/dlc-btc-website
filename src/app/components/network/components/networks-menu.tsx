import { HStack, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
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
  const { chain, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();

  if (!isConnected) {
    return null;
  }

  return (
    <Menu variant={'networkChange'} isOpen={isMenuOpen}>
      <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <HStack justifyContent={'space-evenly'}>
          <Text>{chain ? chain?.name : 'Not Connected'}</Text>
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
