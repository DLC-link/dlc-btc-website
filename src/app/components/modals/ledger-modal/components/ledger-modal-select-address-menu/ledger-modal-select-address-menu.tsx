import { ButtonGroup, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { BitcoinAddressInformation } from '@hooks/use-ledger';
import { SupportedPaymentType } from '@models/supported-payment-types';

import { LedgerModalAddressButton } from './components/ledger-modal-address-button';
import { LedgerModalSelectAddressMenuAccountIndexInput } from './components/ledger-modal-select-address-menu-account-index-input';
import { LedgerModalSelectAddressMenuAddressPaginator } from './components/ledger-modal-select-address-menu-address-paginator';
import { LedgerModalSelectAddressMenuTableHeader } from './components/ledger-modal-select-address-menu-table-header';

interface LedgerModalSelectAddressMenuProps {
  nativeSegwitAddresses: BitcoinAddressInformation[] | undefined;
  taprootAddresses: BitcoinAddressInformation[] | undefined;
  isLoading: boolean;
  isSuccesful: boolean;
  error: string | undefined;
  displayedAddressesStartIndex: number;
  setDisplayedAddressesStartIndex: React.Dispatch<React.SetStateAction<number>>;
  walletAccountIndex: number;
  setWalletAccountIndex: React.Dispatch<React.SetStateAction<number>>;
  setFundingAndTaprootAddress: (index: number, paymentType: SupportedPaymentType) => void;
}

export function LedgerModalSelectAddressMenu({
  nativeSegwitAddresses,
  taprootAddresses,
  isLoading,
  isSuccesful,
  error,
  displayedAddressesStartIndex,
  setDisplayedAddressesStartIndex,
  walletAccountIndex,
  setWalletAccountIndex,
  setFundingAndTaprootAddress,
}: LedgerModalSelectAddressMenuProps): React.JSX.Element | false {
  return (
    !isLoading &&
    !isSuccesful &&
    !error && (
      <Tabs w={'350px'} p={'0px'}>
        <TabList w={'100%'}>
          <Tab>Native Segwit</Tab>
          <Tab>Taproot</Tab>
        </TabList>
        <LedgerModalSelectAddressMenuAccountIndexInput
          walletAccountIndex={walletAccountIndex}
          setWalletAccountIndex={setWalletAccountIndex}
        />
        <LedgerModalSelectAddressMenuTableHeader />
        <TabPanels pt={'2.5%'}>
          <TabPanel>
            <ButtonGroup orientation="vertical" w={'100%'}>
              {nativeSegwitAddresses?.map(address => (
                <LedgerModalAddressButton
                  key={address.address}
                  addressInformation={address}
                  paymentType={SupportedPaymentType.NATIVE_SEGWIT}
                  setFundingAndTaprootAddress={setFundingAndTaprootAddress}
                />
              ))}
            </ButtonGroup>
          </TabPanel>
          <TabPanel>
            <ButtonGroup orientation="vertical" w={'100%'}>
              {taprootAddresses?.map(address => (
                <LedgerModalAddressButton
                  key={address.address}
                  addressInformation={address}
                  paymentType={SupportedPaymentType.TAPROOT}
                  setFundingAndTaprootAddress={setFundingAndTaprootAddress}
                />
              ))}
            </ButtonGroup>
          </TabPanel>
        </TabPanels>
        <LedgerModalSelectAddressMenuAddressPaginator
          displayedAddressesStartIndex={displayedAddressesStartIndex}
          setDisplayedAddressesStartIndex={setDisplayedAddressesStartIndex}
        />
      </Tabs>
    )
  );
}
