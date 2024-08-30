import { HStack, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useAccount, useConfig, useSwitchChain } from 'wagmi';

export function NetworksMenu(): React.JSX.Element {
  const { chains } = useConfig();
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();

  return (
    <Menu variant={'account'}>
      <MenuButton disabled={!chain} fontSize={'small'}>
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
