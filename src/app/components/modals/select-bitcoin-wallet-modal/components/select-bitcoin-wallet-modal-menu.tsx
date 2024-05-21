import { Button, HStack, Image, Text } from '@chakra-ui/react';
import { BitcoinWallet, BitcoinWalletType } from '@models/wallet';

interface SelectBitcoinWalletMenuProps {
  wallet: BitcoinWallet;
  handleClick: (walletType: BitcoinWalletType) => void;
}

export function SelectBitcoinWalletMenu({
  wallet,
  handleClick,
}: SelectBitcoinWalletMenuProps): React.JSX.Element {
  const { id, logo, name } = wallet;

  return (
    <Button variant={'wallet'} onClick={() => handleClick(id)}>
      <HStack justifyContent={'space-evenly'} w={'250px'}>
        <Image src={logo} alt={name} boxSize={'25px'} />
        <Text w={'150px'}>{name}</Text>
      </HStack>
    </Button>
  );
}
