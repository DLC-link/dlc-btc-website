import { useContext } from 'react';

import { Button, HStack, Image, Text } from '@chakra-ui/react';
import { BlockchainContext } from '@providers/blockchain-context-provider';

export function AddTokenButton(): React.JSX.Element {
  const blockchainContext = useContext(BlockchainContext);
  const ethereum = blockchainContext?.ethereum;

  return (
    <HStack w={'100%'} justifyContent={'end'}>
      <Button variant={'vault'} onClick={() => ethereum?.recommendTokenToMetamask()} w={'34.5%'}>
        <HStack>
          <Image src={'/images/logos/dlc-btc-logo.svg'} alt={'dlcBTC'} boxSize={'25px'} />
          <Text> Add Token to Wallet</Text>
        </HStack>
      </Button>
    </HStack>
  );
}
