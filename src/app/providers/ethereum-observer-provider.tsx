import { Box } from '@chakra-ui/react';
import { useEthereumObserver } from '@hooks/use-ethereum-observer';
import { HasChildren } from '@models/has-children';

export function EthereumObserverProvider({ children }: HasChildren): React.JSX.Element {
  useEthereumObserver();

  return <Box>{children}</Box>;
}
