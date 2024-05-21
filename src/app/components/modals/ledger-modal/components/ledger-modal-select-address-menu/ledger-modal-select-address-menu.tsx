import { useEffect, useState } from 'react';

import { Menu, MenuButton, MenuList, SlideFade, Text } from '@chakra-ui/react';

import { LedgerModalSelectAddressMenuItem } from './components/ledger-modal-select-address-menu-item';

interface LedgerModalSelectAddressMenuProps {
  nativeSegwitAddresses: [string, number][] | undefined;
  isLoading: [boolean, string];
  isSuccesful: boolean;
  error: string | undefined;
  setNativeSegwitAddressAndTaprootMultisigAddress: (index: number) => void;
}

export function LedgerModalSelectAddressMenu({
  nativeSegwitAddresses,
  isLoading,
  isSuccesful,
  error,
  setNativeSegwitAddressAndTaprootMultisigAddress,
}: LedgerModalSelectAddressMenuProps): React.JSX.Element {
  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    if (nativeSegwitAddresses && !isLoading[0] && !isSuccesful && !error) {
      setShowComponent(true);
    } else {
      setShowComponent(false);
    }
  }, [nativeSegwitAddresses, isLoading, error, isSuccesful]);

  return (
    <SlideFade in={showComponent} transition={{ enter: { delay: 0.25 } }} unmountOnExit>
      <Menu variant={'ledgerAddress'}>
        <MenuButton>
          <Text>Select Native Segwit Address</Text>
        </MenuButton>
        <MenuList>
          {nativeSegwitAddresses?.map((address, index) => {
            return (
              <LedgerModalSelectAddressMenuItem
                key={index}
                address={address}
                index={index}
                setNativeSegwitAddressAndTaprootMultisigAddress={
                  setNativeSegwitAddressAndTaprootMultisigAddress
                }
              />
            );
          })}
        </MenuList>
      </Menu>
    </SlideFade>
  );
}
