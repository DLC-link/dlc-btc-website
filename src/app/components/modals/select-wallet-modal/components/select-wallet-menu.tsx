import { Button, HStack, Image, Text } from "@chakra-ui/react";
import { Wallet, WalletType } from "@models/wallet";

interface SelectWalletMenuProps {
  wallet: Wallet;
  handleClick: (address: string, walletType: WalletType) => void;
}

export function SelectWalletMenu({
  wallet,
  handleClick,
}: SelectWalletMenuProps): React.JSX.Element {
  const { logo, name } = wallet;

  return (
    <Button
      variant={"wallet"}
      onClick={() => handleClick("123456789123456789", wallet.id)}
    >
      <HStack justifyContent={"space-evenly"} width={"250px"}>
        <Image src={logo} alt={name} boxSize={"25px"} />
        <Text width={"150px"}>{name}</Text>
      </HStack>
    </Button>
  );
}
