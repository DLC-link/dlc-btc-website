import { HStack, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useAccount, useConfig, useSwitchChain } from 'wagmi';

export function NetworksMenu(): React.JSX.Element | null {
  const { chains } = useConfig();
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();

  if (!chain) {
    return null;
  }

  return (
    <Menu variant={'networkChange'}>
      <MenuButton disabled={!chain}>
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
              onClick={() => switchChain({ chainId: ethereumNetwork.id })}
            >
              {ethereumNetwork.name}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}
