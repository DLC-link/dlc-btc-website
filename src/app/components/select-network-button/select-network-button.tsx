import { ChevronDownIcon } from '@chakra-ui/icons';
import { HStack, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { Chain } from 'viem';

interface SelectNetworkButtonProps {
  handleChangeNetwork: (ethereumNetwork: Chain) => void;
  ethereumNetworks: readonly [Chain, ...Chain[]];
  selectedEthereumNetwork?: Chain;
}

export function SelectNetworkButton({
  handleChangeNetwork,
  ethereumNetworks,
  selectedEthereumNetwork,
}: SelectNetworkButtonProps): React.JSX.Element {
  return (
    <Menu variant={'network'}>
      <MenuButton>
        <HStack justifyContent={'space-between'}>
          {selectedEthereumNetwork ? (
            <Text>{selectedEthereumNetwork.name}</Text>
          ) : (
            <Text>{'SELECT NETWORK'}</Text>
          )}
          <ChevronDownIcon color={'white'} />
        </HStack>
      </MenuButton>
      <MenuList>
        {ethereumNetworks.map(ethereumNetwork => {
          return (
            <MenuItem
              key={ethereumNetwork.id}
              value={ethereumNetwork.id}
              onClick={() => handleChangeNetwork(ethereumNetwork)}
            >
              {ethereumNetwork.name}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}
