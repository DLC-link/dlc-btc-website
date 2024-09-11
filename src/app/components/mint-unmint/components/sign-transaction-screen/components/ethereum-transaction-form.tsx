import { Button, FormControl, FormErrorMessage, VStack } from '@chakra-ui/react';
import { VaultMiniCard } from '@components/vault-mini/vault-mini-card';
import { Vault } from '@models/vault';
import { Form, Formik } from 'formik';

import { RiskBox } from '../../risk-box/risk-box';
import { ProtocolFeeBox } from './protocol-fee';
import { TransactionFormInput } from './transaction-form/components/transaction-form-input';

interface BurnTokenTransactionFormValues {
  amount: number;
}

const initialValues: BurnTokenTransactionFormValues = { amount: 0.01 };

interface BurnTokenTransactionFormProps {
  vault?: Vault;
  bitcoinPrice?: number;
  isSubmitting: boolean;
  risk: string;
  isRiskLoading: boolean;
  handleBurn: (tokenAmount: number) => Promise<void>;
  handleCancel: () => void;
}

export function BurnTokenTransactionForm({
  vault,
  bitcoinPrice,
  isSubmitting,
  risk,
  isRiskLoading,
  handleBurn,
  handleCancel,
}: BurnTokenTransactionFormProps): React.JSX.Element {
  return (
    <VStack w={'45%'}>
      <Formik
        initialValues={initialValues}
        onSubmit={async values => {
          await handleBurn(values.amount);
        }}
      >
        {({ handleSubmit, errors, touched, values }) => (
          <Form onSubmit={handleSubmit}>
            <FormControl isInvalid={!!errors.amount && touched.amount}>
              <VStack w={'385px'} spacing={'16.5px'} h={'456.5px'}>
                {vault && <VaultMiniCard vault={vault} />}
                <TransactionFormInput
                  header={'Amount of dlcBTC to burn:'}
                  type={'burn'}
                  values={values}
                  bitcoinPrice={bitcoinPrice}
                  lockedAmount={vault?.valueMinted}
                />
                <FormErrorMessage m={'0px'} fontSize={'xs'}>
                  {errors.amount}
                </FormErrorMessage>
                <ProtocolFeeBox
                  assetAmount={values.amount}
                  bitcoinPrice={bitcoinPrice}
                  protocolFeeBasisPoints={vault?.btcMintFeeBasisPoints}
                />
                {risk === 'High' && <RiskBox risk={risk} isRiskLoading={isRiskLoading} />}
                <Button
                  isLoading={isSubmitting}
                  variant={'account'}
                  type={'submit'}
                  isDisabled={Boolean(errors.amount)}
                >
                  {'Burn dlcBTC'}
                </Button>
                <Button
                  isLoading={isSubmitting}
                  variant={'navigate'}
                  onClick={() => handleCancel()}
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
