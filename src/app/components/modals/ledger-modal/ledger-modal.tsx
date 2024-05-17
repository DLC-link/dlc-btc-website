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
  const [ledgerStep, setLedgerStep] = useState<number[]>([0, 0]);
  const [ledgerError, setLedgerError] = useState<string | undefined>(undefined);

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

  useEffect(() => {
    switch (bitcoinWalletContextState) {
      case BitcoinWalletContextState.SELECT_BITCOIN_WALLET_READY:
        if (ledgerError) {
          setLedgerStep([0, 2]);
        } else if (isLoading[0]) {
          setLedgerStep([0, 1]);
        }
        setLedgerStep([0, 0]);
        break;
      default:
        break;
    }
  }, [bitcoinWalletContextState, ledgerError, isLoading]);

  async function getLedgerNativeSegwitAddresses() {
    try {
      setLedgerError(undefined);
      const nativeSegwitAddresses = await getLedgerAddressesWithBalances('wpkh');
      setNativeSegwitAddresses(nativeSegwitAddresses);
    } catch (error: any) {
      setLedgerError(error.message);
    }
  }

  async function setNativeSegwitAddressAndTaprootMultisigAddress(index: number) {
    try {
      setLedgerError(undefined);
      await getNativeSegwitAccount(index);
      await getTaprootMultisigAccount(mintStep[1]);
      setIsSuccesful(true);
      await delay(2500);
      handleClose();
    } catch (error: any) {
      setLedgerError(error.message);
      throw new Error(error.message);
    }
  }

  return (
    <LedgerModalLayout logo={'/images/logos/ledger-logo.svg'} isOpen={isOpen} onClose={handleClose}>
      <VStack spacing={25} h={'150px'}>
        <ScaleFade in={isSuccesful} transition={{ enter: { delay: 0.25 } }} unmountOnExit>
          <CheckCircleIcon color={'accent.lightBlue.01'} w={'25px'} h={'25px'} />
        </ScaleFade>
        <ScaleFade in={!!ledgerError} unmountOnExit>
          <Button variant={'ledger'} onClick={() => getLedgerNativeSegwitAddresses()}>
            Connect Ledger
          </Button>
        </ScaleFade>
        <ScaleFade in={isLoading[0]} transition={{ enter: { delay: 0.25 } }} unmountOnExit>
          <LedgerLoadingFlag text={isLoading[1]} />
        </ScaleFade>
        <ScaleFade
          in={!!nativeSegwitAddresses && !isLoading[0] && !ledgerError && !isSuccesful}
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
        <ScaleFade in={!!ledgerError} transition={{ enter: { delay: 0.25 } }} unmountOnExit>
          <HStack p={'5%'} w={'375px'} spacing={4} bgColor={'red'} justifyContent={'center'}>
            <Text fontFamily={'Inter'} fontSize={'xs'} fontWeight={'600'}>
              {ledgerError}
            </Text>
          </HStack>
        </ScaleFade>
      </VStack>
    </LedgerModalLayout>
  );
}
