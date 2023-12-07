import { ChevronDownIcon } from '@chakra-ui/icons';
import { HStack, Image, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { easyTruncateAddress } from '@common/utilities';
import { Wallet } from '@models/wallet';

interface AccountMenuProps {
  address: string;
  wallet: Wallet;
  handleClick: () => void;
}

export function AccountMenu({ address, wallet, handleClick }: AccountMenuProps): React.JSX.Element {
  return (
    <Menu variant={'account'}>
      <MenuButton>
        <HStack justifyContent={'space-evenly'}>
          <Image p={'2.5px'} src={wallet?.logo} alt={wallet?.name} boxSize={'35px'} />
          <Text>{easyTruncateAddress(address)}</Text>
          <ChevronDownIcon boxSize={'35px'} color={'white'} />
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => handleClick()}>Disconnect</MenuItem>
      </MenuList>
    </Menu>
  );
}
