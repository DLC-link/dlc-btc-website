import { Button, HStack, Image, Text } from '@chakra-ui/react';

import { Wallet } from '../../../../../shared/models/wallet';

interface WalletMenuProps {
  wallet: Wallet;
}

export function WalletButton({ wallet }: WalletMenuProps): React.JSX.Element {
  const { logo, name } = wallet;

  return (
    <Button variant={'wallet'}>
      <HStack justifyContent={'space-evenly'} width={'250px'}>
        <Image src={logo} alt={name} boxSize={'35px'} />
        <Text width={'150px'}>{name}</Text>
      </HStack>
    </Button>
  );
}
