import { useContext } from 'react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { HStack, Image, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from '@chakra-ui/react';
import { RippleWalletContext } from '@providers/ripple-user-wallet-context-provider';
import { truncateAddress } from 'dlc-btc-lib/utilities';

// import { Connector } from 'wagmi';

interface AccountMenuProps {
  // address?: string;
  // wagmiConnector?: Connector;
  handleDisconnectWallet: () => void;
}

export function AccountMenu({
  // address,
  // wagmiConnector,
  handleDisconnectWallet,
}: AccountMenuProps): React.JSX.Element | false {
  const { rippleWallet } = useContext(RippleWalletContext);
  return (
    <Menu variant={'account'}>
      <MenuButton>
        <HStack justifyContent={'space-evenly'}>
          <Stack bg={'white.01'} borderRadius={'full'} p={'5px'}>
            <Image p={'2.5px'} src={'./images/logos/xpr-logo.svg'} alt={'xrpl'} boxSize={'25px'} />
          </Stack>
          <Text>{truncateAddress(rippleWallet?.classicAddress!)}</Text>
          <ChevronDownIcon boxSize={'35px'} color={'white'} />
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => handleDisconnectWallet()}>Disconnect</MenuItem>
      </MenuList>
    </Menu>
  );
}
