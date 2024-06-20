import {
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { VaultMiniCard } from '@components/vault-mini/vault-mini-card';
import { Vault } from '@models/vault';
import { BitcoinWalletContextState } from '@providers/bitcoin-wallet-context-provider';
import { Form, Formik } from 'formik';

import { RiskBox } from '../../risk-box/risk-box';
import { ProtocolFeeBox } from './protocol-fee';
import { TransactionFormInput } from './transaction-form/components/transaction-form-input';
import { TransactionFormWarning } from './transaction-form/components/transaction-form-warning';

interface TransactionFormValues {
  amount: number;
}

const initialValues: TransactionFormValues = { amount: 0.01 };

const headerMap = {
  deposit: 'Amount of BTC to deposit:',
  withdraw: 'Amount of BTC to withdraw:',
};

interface TransactionFormProps {
  type: 'deposit' | 'withdraw';
  bitcoinWalletContextState: BitcoinWalletContextState;
  vault?: Vault;
  bitcoinPrice?: number;
  isBitcoinWalletLoading: [boolean, string];
  isSubmitting: boolean;
  actionButtonText: string;
  risk: string;
  isRiskLoading: boolean;
  handleConnect: () => void;
  handleSign: (bitcoinAmount: number) => Promise<void>;
  handleCancel: () => void;
}

export function TransactionForm({
  type,
  bitcoinWalletContextState,
  vault,
  bitcoinPrice,
  isBitcoinWalletLoading,
  isSubmitting,
  actionButtonText,
  risk,
  isRiskLoading,
  handleConnect,
  handleSign,
  handleCancel,
}: TransactionFormProps): React.JSX.Element {
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
                {vault && <VaultMiniCard vault={vault} />}
                <TransactionFormInput
                  header={headerMap[type]}
                  values={values}
                  bitcoinPrice={bitcoinPrice}
                />
                <FormErrorMessage m={'0px'} fontSize={'xs'}>
                  {errors.amount}
                </FormErrorMessage>
                <ProtocolFeeBox
                  assetAmount={values.amount}
                  bitcoinPrice={bitcoinPrice}
                  protocolFeeBasisPoints={vault?.btcMintFeeBasisPoints}
                />
                {type === 'deposit' && !errors.amount && !isBitcoinWalletLoading[0] && (
                  <TransactionFormWarning assetAmount={values.amount} />
                )}
                {isBitcoinWalletLoading[0] && (
                  <HStack
                    p={'5%'}
                    w={'100%'}
                    spacing={4}
                    bgColor={'background.content.01'}
                    justifyContent={'space-between'}
                  >
                    <Text fontSize={'sm'} color={'white.01'}>
                      {isBitcoinWalletLoading[1]}
                    </Text>
                    <Spinner size="xs" color="accent.lightBlue.01" />
                  </HStack>
                )}
                {risk === 'High' && <RiskBox risk={risk} isRiskLoading={isRiskLoading} />}
                <Button
                  isLoading={isSubmitting}
                  variant={'account'}
                  type={'submit'}
                  isDisabled={Boolean(errors.amount)}
                >
                  {actionButtonText}
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
