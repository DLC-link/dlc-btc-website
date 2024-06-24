import { useEffect, useState } from 'react';

import {
  HStack,
  Menu,
  MenuButton,
  MenuList,
  Radio,
  RadioGroup,
  SlideFade,
  Text,
  VStack,
} from '@chakra-ui/react';

import { LedgerModalSelectAddressMenuItem } from './components/ledger-modal-select-address-menu-item';

interface LedgerModalSelectAddressMenuProps {
  nativeSegwitAddresses: [string, number][] | undefined;
  taprootAddresses: [string, number][] | undefined;
  isLoading: [boolean, string];
  isSuccesful: boolean;
  error: string | undefined;
  setFundingAndTaprootAddress: (index: number, paymentType: 'wpkh' | 'tr') => void;
}

export function LedgerModalSelectAddressMenu({
  nativeSegwitAddresses,
  taprootAddresses,
  isLoading,
  isSuccesful,
  error,
  setFundingAndTaprootAddress,
}: LedgerModalSelectAddressMenuProps): React.JSX.Element {
  const [showComponent, setShowComponent] = useState(false);
  const [paymentType, setPaymentType] = useState<string>('wpkh');

  useEffect(() => {
    if (nativeSegwitAddresses && !isLoading[0] && !isSuccesful && !error) {
      setShowComponent(true);
    } else {
      setShowComponent(false);
    }
  }, [nativeSegwitAddresses, isLoading, error, isSuccesful]);

  return (
    <SlideFade in={showComponent} transition={{ enter: { delay: 0.25 } }} unmountOnExit>
      <VStack pb={'15px'}>
        <RadioGroup onChange={setPaymentType} value={paymentType}>
          <HStack>
            <Radio colorScheme="purple" value="wpkh">
              Native Segwit
            </Radio>
            <Radio colorScheme="purple" value="tr">
              Taproot
            </Radio>
          </HStack>
        </RadioGroup>
      </VStack>
      <Menu variant={'ledgerAddress'}>
        <MenuButton>
          <Text>Select Funding Address</Text>
        </MenuButton>
        <MenuList>
          {paymentType === 'wpkh'
            ? nativeSegwitAddresses?.map((address, index) => (
                <LedgerModalSelectAddressMenuItem
                  key={index}
                  address={address}
                  paymentType="wpkh"
                  index={index}
                  setFundingAndTaprootAddress={setFundingAndTaprootAddress}
                />
              ))
            : taprootAddresses?.map((address, index) => (
                <LedgerModalSelectAddressMenuItem
                  key={index}
                  address={address}
                  paymentType="tr"
                  index={index}
                  setFundingAndTaprootAddress={setFundingAndTaprootAddress}
                />
              ))}
        </MenuList>
      </Menu>
    </SlideFade>
  );
}
