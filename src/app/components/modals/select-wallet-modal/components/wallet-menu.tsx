import { HStack, Image, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';

import { Wallet } from '../../../../../shared/models/wallet';

interface WalletMenuProps {
  wallet: Wallet;
}

export function WalletMenu({ wallet }: WalletMenuProps): React.JSX.Element {
  const { logo, name, networks } = wallet;

  return (
    <Menu variant={'wallet'}>
      {({ isOpen }) => (
        <>
          <MenuButton>
            <HStack justifyContent={'space-evenly'}>
              <Image src={logo} alt={name} boxSize={'35px'} />
              <Text width={'250px'}>{isOpen ? 'Choose Network' : name}</Text>
              <HStack width={'35px'} />
            </HStack>
          </MenuButton>
          <MenuList>
            {networks.map((network, idx) => {
              return (
                <MenuItem key={`network-${idx}`} onClick={() => {}}>
                    {network.name}
                </MenuItem>
              );
            })}
          </MenuList>
        </>
      )}
    </Menu>
  );
}
