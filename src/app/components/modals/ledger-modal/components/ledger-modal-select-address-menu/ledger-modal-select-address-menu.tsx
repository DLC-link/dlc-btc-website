import { useEffect, useState } from 'react';

import {
  Button,
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
import { SupportedPaymentType } from '@models/supported-payment-types';

import { LedgerModalSelectAddressMenuItem } from './components/ledger-modal-select-address-menu-item';

interface LedgerModalSelectAddressMenuProps {
  nativeSegwitAddresses: [string, number][] | undefined;
  taprootAddresses: [string, number][] | undefined;
  isLoading: [boolean, string];
  isSuccesful: boolean;
  error: string | undefined;
  startIndex: number;
  setStartIndex: React.Dispatch<React.SetStateAction<number>>;
  setFundingAndTaprootAddress: (index: number, paymentType: SupportedPaymentType) => void;
}

export function LedgerModalSelectAddressMenu({
  nativeSegwitAddresses,
  taprootAddresses,
  isLoading,
  isSuccesful,
  error,
  startIndex,
  setStartIndex,
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
            <Button isDisabled={startIndex === 0} onClick={() => setStartIndex(startIndex - 5)}>
              -
            </Button>
            <Button onClick={() => setStartIndex(startIndex + 5)}>+</Button>
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
                  paymentType={SupportedPaymentType.NATIVE_SEGWIT}
                  index={index}
                  setFundingAndTaprootAddress={setFundingAndTaprootAddress}
                />
              ))
            : taprootAddresses?.map((address, index) => (
                <LedgerModalSelectAddressMenuItem
                  key={index}
                  address={address}
                  paymentType={SupportedPaymentType.TAPROOT}
                  index={index}
                  setFundingAndTaprootAddress={setFundingAndTaprootAddress}
                />
              ))}
        </MenuList>
      </Menu>
    </SlideFade>
  );
}
