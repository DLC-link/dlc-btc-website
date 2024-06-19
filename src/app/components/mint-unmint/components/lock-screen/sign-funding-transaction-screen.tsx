import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Spinner,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { VaultMiniCard } from '@components/vault-mini/vault-mini-card';
import { useVaults } from '@hooks/use-vaults';
import { BitcoinError } from '@models/error-types';
import {
  BitcoinWalletContext,
  BitcoinWalletContextState,
} from '@providers/bitcoin-wallet-context-provider';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { modalActions } from '@store/slices/modal/modal.actions';
import { Form, Formik } from 'formik';

import { TransactionFormInput } from '../transaction-form/components/transaction-form-input';
import { TransactionFormWarning } from '../transaction-form/components/transaction-form-warning';
import { LockScreenProtocolFee } from './components/protocol-fee';

interface SignFundingTransactionScreenProps {
  currentStep: [number, string];
  handleSignFundingTransaction: (bitcoinAmount: number) => Promise<void>;
  isLoading: [boolean, string];
}

export interface TransactionFormValues {
  amount: number;
}

const initialValues: TransactionFormValues = { amount: 0.01 };

export function SignFundingTransactionScreen({
  currentStep,
  handleSignFundingTransaction,
  isLoading,
}: SignFundingTransactionScreenProps): React.JSX.Element {
  const toast = useToast();
  const dispatch = useDispatch();

  const { bitcoinWalletContextState, resetBitcoinWalletContext } = useContext(BitcoinWalletContext);

  const { bitcoinPrice } = useContext(ProofOfReserveContext);
  const { readyVaults } = useVaults();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentVault = readyVaults.find(vault => vault.uuid === currentStep[1]);
  const [buttonText, setButtonText] = useState('Select Bitcoin Wallet');

  useEffect(() => {
    switch (bitcoinWalletContextState) {
      case BitcoinWalletContextState.INITIAL:
        setButtonText('Connect Bitcoin Wallet');
        break;
      case BitcoinWalletContextState.READY:
        setButtonText('Sign Funding Transaction');
        break;
      default:
        setButtonText('Connect Bitcoin Wallet');
        break;
    }
  }, [bitcoinWalletContextState]);

  async function handleSign(bitcoinAmount: number) {
    if (!currentVault) return;

    try {
      setIsSubmitting(true);
      await handleSignFundingTransaction(bitcoinAmount);
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: 'Failed to sign transaction',
        description: error instanceof BitcoinError ? error.message : '',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }

  async function handleConnect() {
    dispatch(modalActions.toggleSelectBitcoinWalletModalVisibility());
  }

  return (
    <VStack w={'45%'}>
      <Formik
        initialValues={initialValues}
        onSubmit={async values => {
          if (bitcoinWalletContextState === BitcoinWalletContextState.READY) {
            await handleSign(values.amount);
          } else {
            await handleConnect();
          }
        }}
      >
        {({ handleSubmit, errors, touched, values }) => (
          <Form onSubmit={handleSubmit}>
            <FormControl isInvalid={!!errors.amount && touched.amount}>
              <VStack w={'385px'} spacing={'16.5px'} h={'456.5px'}>
                {currentVault && <VaultMiniCard vault={currentVault} />}
                <TransactionFormInput values={values} bitcoinPrice={bitcoinPrice} />
                <FormErrorMessage m={'0px'} fontSize={'xs'}>
                  {errors.amount}
                </FormErrorMessage>
                <LockScreenProtocolFee
                  assetAmount={values.amount}
                  bitcoinPrice={bitcoinPrice}
                  protocolFeePercentage={currentVault?.btcMintFeeBasisPoints}
                />
                {!errors.amount && !isLoading[0] && (
                  <TransactionFormWarning assetAmount={values.amount} />
                )}
                {isLoading[0] && (
                  <HStack
                    p={'5%'}
                    w={'100%'}
                    spacing={4}
                    bgColor={'background.content.01'}
                    justifyContent={'space-between'}
                  >
                    <Text fontSize={'sm'} color={'white.01'}>
                      {isLoading[1]}
                    </Text>
                    <Spinner size="xs" color="accent.lightBlue.01" />
                  </HStack>
                )}
                <Button
                  isLoading={isSubmitting}
                  variant={'account'}
                  type={'submit'}
                  isDisabled={Boolean(errors.amount)}
                >
                  {buttonText}
                </Button>
                <Button
                  isLoading={isSubmitting}
                  variant={'navigate'}
                  onClick={() => {
                    resetBitcoinWalletContext();
                    dispatch(mintUnmintActions.setMintStep([0, '']));
                  }}
                >
                  Cancel
                </Button>
              </VStack>
            </FormControl>
          </Form>
        )}
      </Formik>
    </VStack>
  );
}
