import {
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useAccount, useConfig, useSwitchChain } from 'wagmi';

interface NetworksMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
}

const networkLogos: Record<number, string> = {
  1: './images/logos/arbitrum-token.svg', // Arbitrum
  3: './images/logos/ethereum-token.svg', // Ethereum
  4: './images/logos/base-token.svg', // Base
};

const getNetworkLogo = (chainId: number | undefined) => {
  return chainId
    ? //TODO: what to display in case of not connected?
      networkLogos[chainId] || './images/logos/dlc-btc-logo.svg'
    : './images/logos/dlc-btc-logo.svg';
};

export function NetworksMenu({
  isMenuOpen,
  setIsMenuOpen,
}: NetworksMenuProps): React.JSX.Element | null {
  const { chains } = useConfig();
  const { chain, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  //TODO: maybe add the network logo to the setstate?

  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!isConnected) {
    return null;
  }

  return (
    <Menu variant={'networkChange'} isOpen={isMenuOpen}>
      <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMobile ? (
          <Image src={getNetworkLogo(chain?.id)} alt={'Selected network logo'} />
        ) : (
          //TODO: what to display in case of not connected?
          <HStack justifyContent={'space-evenly'}>
            <Text>Network</Text>
            <Text>{chain ? chain?.name : 'Not Connected'}</Text>
          </HStack>
        )}
      </MenuButton>
      <MenuList>
        {chains.map(ethereumNetwork => {
          return (
            <MenuItem
              key={ethereumNetwork.id}
              value={ethereumNetwork.id}
              onClick={() => {
                switchChain({ chainId: ethereumNetwork.id });
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              {ethereumNetwork.name}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}
