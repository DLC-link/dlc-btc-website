import { HStack, Image, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { EthereumNetwork, EthereumNetworkID, ethereumNetworks } from '@models/ethereum-network';

interface NetworkMenuProps {
  handleClick: (network: EthereumNetwork) => void;
  currentNetwork?: EthereumNetwork;
}

const selectLogo = (networkID?: EthereumNetworkID): string => {
  if (networkID === undefined) return '';
  switch (networkID) {
    case EthereumNetworkID.ArbSepolia:
      return '/images/logos/arbitrum-logo.svg';
    case EthereumNetworkID.Hardhat:
      return '/images/logos/ethereum-logo.svg';

    default:
      return '';
  }
};

export function NetworkMenu({ handleClick, currentNetwork }: NetworkMenuProps): React.JSX.Element {
  const enabledEthereumNetworkIDs = appConfiguration.enabledEthereumNetworkIDs;
  const enabledEthereumNetworks = ethereumNetworks.filter(network =>
    enabledEthereumNetworkIDs.includes(network.id)
  );
  return (
    <Menu variant={'networkMenu'}>
      <MenuButton>
        <HStack justifyContent={'space-evenly'}>
          <Image
            p={'2.5px'}
            src={selectLogo(currentNetwork?.id)}
            alt={currentNetwork?.displayName}
            boxSize={'35px'}
          />
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
