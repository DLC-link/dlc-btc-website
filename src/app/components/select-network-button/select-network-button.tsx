import { ChevronDownIcon } from '@chakra-ui/icons';
import { HStack, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { Network, ethereumNetworks } from '@models/network';

interface SelectNetworkButtonProps {
  handleClick: (network: Network) => void;
  currentNetwork?: Network;
}

export function SelectNetworkButton({
  handleClick,
  currentNetwork,
}: SelectNetworkButtonProps): React.JSX.Element {
  const enabledEthereumNetworkIDs = import.meta.env.VITE_ENABLED_ETHEREUM_NETWORKS.split(',');
  const enabledEthereumNetworks = ethereumNetworks.filter(network =>
    enabledEthereumNetworkIDs.includes(network.id)
  );

  return (
    <Menu variant={'network'}>
      <MenuButton>
        <HStack justifyContent={'space-between'}>
          <Text>{currentNetwork ? currentNetwork.name : 'SELECT NETWORK'}</Text>
          <ChevronDownIcon color={'white'} />
        </HStack>
      </MenuButton>
      <MenuList>
        {enabledEthereumNetworks.map((network, id) => {
          return (
            <MenuItem key={id} value={network.id} onClick={() => handleClick(network)}>
              {network.name}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}
