import { ChevronDownIcon } from '@chakra-ui/icons';
import { HStack, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { supportedEthereumNetworks } from 'dlc-btc-lib/constants';
import { EthereumNetwork } from 'dlc-btc-lib/models';

interface SelectNetworkButtonProps {
  handleClick: (network: EthereumNetwork) => void;
  currentNetwork?: EthereumNetwork;
}

export function SelectNetworkButton({
  handleClick,
  currentNetwork,
}: SelectNetworkButtonProps): React.JSX.Element {
  const enabledEthereumNetworkIDs = appConfiguration.enabledEthereumNetworkIDs;
  const enabledEthereumNetworks = supportedEthereumNetworks.filter(network =>
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
              {network.displayName}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}
