import { ChevronDownIcon } from '@chakra-ui/icons';
import { HStack, Image, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { truncateAddress } from 'dlc-btc-lib/utilities';
import { Connector } from 'wagmi';

interface AccountMenuProps {
  address?: string;
  wagmiConnector?: Connector;
  handleDisconnectWallet: () => void;
}

export function AccountMenu({
  address,
  wagmiConnector,
  handleDisconnectWallet,
}: AccountMenuProps): React.JSX.Element | false {
  if (!address || !wagmiConnector) return false;
  return (
    <Menu variant={'account'}>
      <MenuButton>
        <HStack justifyContent={'space-evenly'}>
          <Image p={'2.5px'} src={wagmiConnector.icon} alt={wagmiConnector.name} boxSize={'35px'} />
          <Text>{truncateAddress(address)}</Text>
          <ChevronDownIcon boxSize={'35px'} color={'white'} />
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => handleDisconnectWallet()}>Disconnect</MenuItem>
      </MenuList>
    </Menu>
  );
}
