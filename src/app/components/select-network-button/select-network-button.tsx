import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { Network, ethereumNetworks } from "@models/network";

interface SelectNetworkButtonProps {
  handleClick: (network: Network) => void;
  currentNetwork?: Network;
}

export function SelectNetworkButton({
  handleClick,
  currentNetwork,
}: SelectNetworkButtonProps): React.JSX.Element {
  return (
    <Menu variant={"network"}>
      <MenuButton>
        <HStack justifyContent={"space-between"}>
          <Text>{currentNetwork ? currentNetwork.name : "SELECT NETWORK"}</Text>
          <ChevronDownIcon color={"white"} />
        </HStack>
      </MenuButton>
      <MenuList>
        {ethereumNetworks.map((network, id) => {
          return (
            <MenuItem
              key={id}
              value={network.id}
              onClick={() => handleClick(network)}
            >
              {network.name}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}
