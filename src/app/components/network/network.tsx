import { HStack } from '@chakra-ui/react';

import { NetworksMenu } from './components/networks-menu';

interface NetworkBoxProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
}

export function NetworkBox({ isMenuOpen, setIsMenuOpen }: NetworkBoxProps): React.JSX.Element {
  return (
    <HStack w={'175px'}>
      <NetworksMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </HStack>
  );
}
