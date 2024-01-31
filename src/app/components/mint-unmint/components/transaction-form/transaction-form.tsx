import { useContext, useState } from 'react';

import { Button, Checkbox, Fade, FormControl, FormErrorMessage, HStack, Stack, Text, VStack, useToast } from '@chakra-ui/react';
import { EthereumError } from '@models/error-types';
import { BlockchainContext } from '@providers/blockchain-context-provider';
import { Form, Formik } from 'formik';

import { TransactionFormInput } from './components/transaction-form-input';
import { TransactionFormWarning } from './components/transaction-form-warning';
import { customShiftValue } from '@common/utilities';
import { SignAndBroadcastFundingPSBTResult } from '@hooks/use-bitcoin';

export interface TransactionFormValues {
  amount: number;
}

const initialValues: TransactionFormValues = { amount: 0.001 };

export function TransactionForm(): React.JSX.Element {
  const toast = useToast();
  const blockchainContext = useContext(BlockchainContext);
  const bitcoinPrice = blockchainContext?.bitcoin.bitcoinPrice;
  const [fundingTransactionSigned, setFundingTransactionSigned] = useState(false);
  const [closingTransactionSigned, setClosingTransactionSigned] = useState(false);
  const [fundingTransactionResult, setFundingTransactionResult] = useState<SignAndBroadcastFundingPSBTResult | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSetup(btcDepositAmount: number) {
    try {
      setIsSubmitting(true);
      const shiftedBTCDepositAmount = customShiftValue(btcDepositAmount, 8, false);
      if (!fundingTransactionSigned) {
      const fundingResult = await blockchainContext?.bitcoin.signAndBroadcastFundingPSBT(shiftedBTCDepositAmount);
      if (!fundingResult) {
        throw new Error('Failed to create vault');
      }
      setFundingTransactionSigned(true);
      setFundingTransactionResult(fundingResult);
      await blockchainContext?.bitcoin.signClosingPSBT(fundingResult);
      setClosingTransactionSigned(true)
    } else {
      if (!fundingTransactionResult) {
        throw new Error('Failed to create vault');
      }
      await blockchainContext?.bitcoin.signClosingPSBT(fundingTransactionResult);
      setClosingTransactionSigned(true)
    }
      setIsSubmitting(false);
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
                <Stack w={'100%'} spacing={'10px'}>
                <Fade in={isSubmitting || fundingTransactionSigned}>
                <VStack w={'100%'} spacing={'10px'}>
                  <HStack w={'100%'} justifyContent={'space-between'}>
                <Checkbox iconColor={'accent.cyan.01'} isChecked={fundingTransactionSigned} isDisabled/>
                <Text color={'accent.cyan.01'}>
                  Funding Transaction Signed
                </Text>
                </HStack>
                <HStack w={'100%'} justifyContent={'space-between'}>
                <Checkbox iconColor={'accent.cyan.01'} isChecked={closingTransactionSigned} isDisabled/>
                <Text color={'accent.cyan.01'}>
                  Closing Transaction Signed
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
