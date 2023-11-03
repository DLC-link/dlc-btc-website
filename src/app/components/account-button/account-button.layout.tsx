import { Menu, MenuButton } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface ConnectAccountButtonProps {
  children: ReactNode;
  handleClick: () => void;
}

export function AccountButtonLayout({
  children,
  handleClick,
}: ConnectAccountButtonProps): React.JSX.Element {
  return (
    <Menu>
      <MenuButton onClick={() => handleClick()}>{children}</MenuButton>
    </Menu>
  );
}
