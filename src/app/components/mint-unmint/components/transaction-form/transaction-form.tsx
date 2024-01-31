import { useContext, useState } from 'react';

import {
  Button,
  Checkbox,
  Fade,
  FormControl,
  FormErrorMessage,
  HStack,
  Stack,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { customShiftValue } from '@common/utilities';
import { useSignPSBT } from '@hooks/use-sign-psbt';
import { BitcoinError } from '@models/error-types';
import { BlockchainContext } from '@providers/blockchain-context-provider';
import { Form, Formik } from 'formik';

import { TransactionFormInput } from './components/transaction-form-input';
import { TransactionFormWarning } from './components/transaction-form-warning';

export interface TransactionFormValues {
  amount: number;
}

const initialValues: TransactionFormValues = { amount: 0.001 };

export function TransactionForm(): React.JSX.Element {
  const toast = useToast();
  const blockchainContext = useContext(BlockchainContext);
  const { handleSignTransaction, fundingTransactionSigned, closingTransactionSigned } = useSignPSBT(
    blockchainContext?.bitcoin
  );
  const bitcoinPrice = blockchainContext?.bitcoin.bitcoinPrice;
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSetup(btcDepositAmount: number) {
    try {
      setIsSubmitting(true);
      const shiftedBTCDepositAmount = customShiftValue(btcDepositAmount, 8, false);
      await handleSignTransaction(shiftedBTCDepositAmount);
      setIsSubmitting(false);
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

  return (
    <VStack w={'300px'}>
      <Formik
        initialValues={initialValues}
        onSubmit={async values => {
          await handleSetup(values.amount);
        }}
      >
        {({ handleSubmit, errors, touched, values }) => (
          <Form onSubmit={handleSubmit}>
            <FormControl isInvalid={!!errors.amount && touched.amount}>
              <VStack spacing={'15px'} w={'300px'}>
                <Text w={'100%'} color={'accent.cyan.01'}>
                  Amount of dlcBTC you want to mint:
                </Text>
                <TransactionFormInput values={values} bitcoinPrice={bitcoinPrice} />
                <FormErrorMessage fontSize={'xs'}>{errors.amount}</FormErrorMessage>
                <TransactionFormWarning assetAmount={values.amount} />
                <Button
                  isLoading={isSubmitting}
                  variant={'account'}
                  type={'submit'}
                  isDisabled={Boolean(errors.amount)}
                >
                  {fundingTransactionSigned ? 'Sign Closing Transaction' : 'Lock Bitcoin'}
                </Button>
                <Stack w={'100%'}>
                  <Fade
                    in={isSubmitting || (fundingTransactionSigned && !closingTransactionSigned)}
                  >
                    <VStack
                      w={'100%'}
                      spacing={'10px'}
                      p={'15px'}
                      bgColor={'white.03'}
                      borderRadius={'md'}
                    >
                      <HStack w={'100%'} justifyContent={'space-between'}>
                        <Checkbox
                          iconColor={'accent.orange.01'}
                          isChecked={fundingTransactionSigned}
                          isDisabled
                        />
                        <Text color={'white.01'} fontSize={'sm'} fontWeight={800}>
                          Funding Transaction
                        </Text>
                      </HStack>
                      <HStack w={'100%'} justifyContent={'space-between'}>
                        <Checkbox
                          iconColor={'accent.orange.01'}
                          isChecked={closingTransactionSigned}
                          isDisabled
                        />
                        <Text color={'white.01'} fontSize={'sm'} fontWeight={800}>
                          Closing Transaction
                        </Text>
                      </HStack>
                    </VStack>
                  </Fade>
                </Stack>
              </VStack>
            </FormControl>
          </Form>
        )}
      </Formik>
    </VStack>
  );
}
