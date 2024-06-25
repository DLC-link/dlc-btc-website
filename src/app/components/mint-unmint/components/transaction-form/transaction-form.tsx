import { useContext, useState } from 'react';

import { Button, FormControl, FormErrorMessage, Text, VStack, useToast } from '@chakra-ui/react';
import { EthereumError } from '@models/error-types';
import { EthereumHandlerContext } from '@providers/ethereum-handler-context-provider';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';
import { shiftValue } from 'dlc-btc-lib/utilities';
import { Form, Formik } from 'formik';

import { TransactionFormInput } from './components/transaction-form-input';
import { TransactionFormWarning } from './components/transaction-form-warning';

export interface TransactionFormValues {
  amount: number;
}

const initialValues: TransactionFormValues = { amount: 0.01 };

export function TransactionForm(): React.JSX.Element {
  const toast = useToast();

  const { ethereumHandler } = useContext(EthereumHandlerContext);
  const { bitcoinPrice } = useContext(ProofOfReserveContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSetup(btcDepositAmount: number) {
    try {
      setIsSubmitting(true);
      const shiftedBTCDepositAmount = shiftValue(btcDepositAmount);
      await ethereumHandler?.setupVault(shiftedBTCDepositAmount);
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: 'Failed to create vault',
        description: error instanceof EthereumError ? error.message : '',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }

  return (
    <VStack w={'45%'}>
      <Formik
        initialValues={initialValues}
        onSubmit={async values => {
          await handleSetup(values.amount);
        }}
      >
        {({ handleSubmit, errors, touched, values }) => (
          <Form onSubmit={handleSubmit}>
            <FormControl isInvalid={!!errors.amount && touched.amount}>
              <VStack spacing={'15px'} w={'100%'}>
                <Text w={'100%'} color={'accent.lightBlue.01'}>
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
                  Create Vault
                </Button>
              </VStack>
            </FormControl>
          </Form>
        )}
      </Formik>
    </VStack>
  );
}
