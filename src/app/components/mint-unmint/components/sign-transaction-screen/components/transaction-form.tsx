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

import { AttestorApprovementPendingStack } from '../../attestor-approvement-pending-stack/attestor-approvement-pending-stack';
import { RiskBox } from '../../risk-box/risk-box';
import { ProtocolFeeBox } from './protocol-fee';
import { TransactionFormInput } from './transaction-form/components/transaction-form-input';
import { TransactionFormWarning } from './transaction-form/components/transaction-form-warning';

interface DepositBitcoinTransactionFormValues {
  amount: number;
}

const initialValues: DepositBitcoinTransactionFormValues = { amount: 0.01 };

interface DepositBitcoinTransactionFormProps {
  vault?: Vault;
  bitcoinWalletContextState: BitcoinWalletContextState;
  isBitcoinWalletLoading: [boolean, string];
  bitcoinPrice?: number;
  isSubmitting: boolean;
  isAttestorApprovePending: boolean;
  userEthereumAddressRiskLevel: string;
  isUserEthereumAddressRiskLevelLoading: boolean;
  depositLimit: { minimumDeposit: number; maximumDeposit: number } | undefined;
  handleConnect: () => void;
  handleDeposit: (depositAmount: number) => Promise<void>;
  handleCancel: () => void;
}

export function DepositBitcoinTransactionForm({
  vault,
  bitcoinWalletContextState,
  isBitcoinWalletLoading,
  bitcoinPrice,
  isSubmitting,
  isAttestorApprovePending,
  userEthereumAddressRiskLevel,
  isUserEthereumAddressRiskLevelLoading,
  depositLimit,
  handleConnect,
  handleDeposit,
  handleCancel,
}: DepositBitcoinTransactionFormProps): React.JSX.Element {
  async function handleClick(depositAmount: number) {
    if (bitcoinWalletContextState === BitcoinWalletContextState.READY) {
      await handleDeposit(depositAmount);
    } else {
      handleConnect();
    }
  }

  return (
    <VStack w={'45%'}>
      <Formik
        initialValues={initialValues}
        onSubmit={async values => await handleClick(values.amount)}
      >
        {({ handleSubmit, handleChange, errors, touched, values }) => (
          <Form onSubmit={handleSubmit} onChange={handleChange}>
            <FormControl isInvalid={!!errors.amount && touched.amount}>
              <VStack w={'385px'} spacing={'16.5px'} h={'456.5px'}>
                {vault && <VaultMiniCard vault={vault} />}
                <TransactionFormInput
                  header={'Amount of dlcBTC to mint:'}
                  type={'mint'}
                  values={values}
                  depositLimit={depositLimit}
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
                {!errors.amount && !isBitcoinWalletLoading[0] && (
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

                {['High', 'Severe'].includes(userEthereumAddressRiskLevel) && (
                  <RiskBox
                    risk={userEthereumAddressRiskLevel}
                    isRiskLoading={isUserEthereumAddressRiskLevelLoading}
                  />
                )}
                {isAttestorApprovePending ? (
                  <AttestorApprovementPendingStack />
                ) : (
                  <>
                    <Button
                      isLoading={isSubmitting}
                      variant={'account'}
                      type={'submit'}
                      isDisabled={Boolean(errors.amount)}
                    >
                      {bitcoinWalletContextState === BitcoinWalletContextState.READY
                        ? 'Sign Deposit Transaction'
                        : 'Connect Wallet'}
                    </Button>
                    <Button
                      isLoading={isSubmitting}
                      variant={'navigate'}
                      onClick={() => handleCancel()}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </VStack>
            </FormControl>
          </Form>
        )}
      </Formik>
    </VStack>
  );
}
