import { Button, FormControl, FormErrorMessage, Text, VStack } from '@chakra-ui/react';
import { useBitcoinPrice } from '@hooks/use-bitcoin-price';
import { Form, Formik } from 'formik';

import { TransactionFormInput } from './components/withdrawal-from-input';

export interface TransactionFormValues {
  amount: number;
}

interface WithdrawalFormProps {
  buttonText: string;
  handleWithdraw: (btcDepositAmount: number) => Promise<void>;
  isSubmitting: boolean;
}

const initialValues: TransactionFormValues = { amount: 0.01 };

export function WithdrawalForm({
  buttonText,
  handleWithdraw,
  isSubmitting,
}: WithdrawalFormProps): React.JSX.Element {
  const { bitcoinPrice } = useBitcoinPrice();

  return (
    <VStack w={'100%'}>
      <Formik
        initialValues={initialValues}
        onSubmit={async values => {
          await handleWithdraw(values.amount);
        }}
      >
        {({ handleSubmit, errors, touched, values }) => (
          <Form onSubmit={handleSubmit}>
            <FormControl isInvalid={!!errors.amount && touched.amount}>
              <VStack spacing={'15px'} w={'100%'}>
                <Text w={'100%'} color={'accent.lightBlue.01'}>
                  Amount of dlcBTC you want to withdraw:
                </Text>
                <TransactionFormInput values={values} bitcoinPrice={bitcoinPrice} />
                <FormErrorMessage fontSize={'xs'}>{errors.amount}</FormErrorMessage>
                <Button
                  isLoading={isSubmitting}
                  variant={'account'}
                  type={'submit'}
                  isDisabled={Boolean(errors.amount)}
                >
                  {buttonText}
                </Button>
              </VStack>
            </FormControl>
          </Form>
        )}
      </Formik>
    </VStack>
  );
}
