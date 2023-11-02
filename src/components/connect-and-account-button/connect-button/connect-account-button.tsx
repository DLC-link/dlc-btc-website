import { HStack, Menu, MenuButton, Text } from '@chakra-ui/react';

interface ConnectAccountButtonProps {
  handleClick: () => void;
}

export function ConnectAccountButton({
  handleClick,
}: ConnectAccountButtonProps): React.JSX.Element {
  return (
    <Menu>
      <MenuButton
        height={'50px'}
        width={'150px'}
        padding={'2.5'}
        borderRadius={'lg'}
        shadow={'dark-lg'}
        onClick={() => handleClick()}
      >
        <HStack justifyContent={'space-between'}>
          <Text fontSize={12} fontWeight={'extrabold'} color={'accent'}>
            Connect Wallet
          </Text>
        </HStack>
      </MenuButton>
    </Menu>
  );
}
