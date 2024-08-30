import { HStack } from '@chakra-ui/react';

import { NetworksMenu } from './components/networks-menu';

export function NetworkBox(): React.JSX.Element {
  return (
    <HStack w={'175px'}>
      <NetworksMenu />
    </HStack>
  );
}
