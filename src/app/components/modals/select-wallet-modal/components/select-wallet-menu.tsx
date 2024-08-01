import { Button, HStack, Image, Text } from '@chakra-ui/react';
import { Connector } from 'wagmi';

interface SelectWalletMenuProps {
  wagmiConnector: Connector;
  handleConnectWallet: (wagmiConnector: Connector) => void;
}

export function SelectWalletMenu({
  wagmiConnector,
  handleConnectWallet,
}: SelectWalletMenuProps): React.JSX.Element {
  const { icon, name } = wagmiConnector;

  return (
    <Button variant={'wallet'} onClick={() => handleConnectWallet(wagmiConnector)}>
      <HStack justifyContent={'space-evenly'} w={'250px'}>
        <Image src={icon} alt={name} boxSize={'25px'} />
        <Text w={'150px'}>{name}</Text>
      </HStack>
    </Button>
  );
}
