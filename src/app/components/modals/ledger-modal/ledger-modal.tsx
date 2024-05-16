import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { CheckCircleIcon } from '@chakra-ui/icons';
import {
  Button,
  Fade,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  ScaleFade,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react';
import { delay, easyTruncateAddress, shiftValue, unshiftValue } from '@common/utilities';
import { LedgerInformation, useLedger } from '@hooks/use-ledger';
import {
  BitcoinWalletContext,
  BitcoinWalletContextState,
} from '@providers/ledger-context-provider';
import { RootState } from '@store/index';

import { ModalComponentProps } from '../components/modal-container';
import { LedgerLoadingFlag } from './components/ledger-modal-account-loading-stack';
import { LedgerModalLayout } from './components/ledger-modal-layout';

export function LedgerModal({ isOpen, handleClose }: ModalComponentProps): React.JSX.Element {
  const { mintStep } = useSelector((state: RootState) => state.mintunmint);
  const { bitcoinWalletContextState } = useContext(BitcoinWalletContext);
  const [isSuccesful, setIsSuccesful] = useState(false);

  const [nativeSegwitAddresses, setNativeSegwitAddresses] = useState<
    [string, number][] | undefined
  >(undefined);
  const {
    getLedgerAddressesWithBalances,
    getNativeSegwitAccount,
    getTaprootMultisigAccount,
    isLoading,
  } = useLedger();

  useEffect(() => {
    if (isOpen) {
      getLedgerNativeSegwitAddresses();
    }
  }, [isOpen]);

  async function getLedgerNativeSegwitAddresses() {
    try {
      const nativeSegwitAddresses = await getLedgerAddressesWithBalances('wpkh');
      setNativeSegwitAddresses(nativeSegwitAddresses);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async function setNativeSegwitAddressAndTaprootMultisigAddress(index: number) {
    try {
      await getNativeSegwitAccount(index);
      await getTaprootMultisigAccount(mintStep[1]);
      setIsSuccesful(true);
      await delay(2500);
      handleClose();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  return (
    <LedgerModalLayout logo={'/images/logos/ledger-logo.svg'} isOpen={isOpen} onClose={handleClose}>
      <ScaleFade in={isSuccesful} transition={{ enter: { delay: 0.25 } }} unmountOnExit>
        <CheckCircleIcon color={'accent.lightBlue.01'} w={'25px'} h={'25px'} />
      </ScaleFade>
      <VStack spacing={25} h={'150px'}>
        <ScaleFade in={isLoading[0]} transition={{ enter: { delay: 0.25 } }} unmountOnExit>
          <LedgerLoadingFlag text={isLoading[1]} />
        </ScaleFade>
        <ScaleFade
          in={
            bitcoinWalletContextState === BitcoinWalletContextState.SELECT_BITCOIN_WALLET_READY &&
            !!nativeSegwitAddresses &&
            !isLoading[0]
          }
          transition={{ enter: { delay: 0.25 } }}
          unmountOnExit
        >
          <Menu variant={'ledgerAddress'}>
            <MenuButton>
              <Text>Select Native Segwit Address</Text>
            </MenuButton>
            <MenuList>
              {nativeSegwitAddresses?.map((address, index) => {
                return (
                  <MenuItem
                    key={index}
                    value={index}
                    onClick={() => setNativeSegwitAddressAndTaprootMultisigAddress(index)}
                  >
                    <HStack w={'275px'} justifyContent={'space-between'}>
                      <Text>{easyTruncateAddress(address[0])}</Text>
                      <Text>{address[1]} BTC</Text>
                    </HStack>
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
        </ScaleFade>
      </VStack>
    </LedgerModalLayout>
  );
}
