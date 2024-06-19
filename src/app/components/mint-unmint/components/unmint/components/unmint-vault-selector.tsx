import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
import { VaultCard } from '@components/vault/vault-card';
import { VaultsListGroupContainer } from '@components/vaults-list/components/vaults-list-group-container';
import { VaultsList } from '@components/vaults-list/vaults-list';
import { useEthereum } from '@hooks/use-ethereum';
import { useVaults } from '@hooks/use-vaults';
import { Vault } from '@models/vault';
import {
  BitcoinWalletContext,
  BitcoinWalletContextState,
} from '@providers/bitcoin-wallet-context-provider';
import { ProofOfReserveContext } from '@providers/proof-of-reserve-context-provider';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { modalActions } from '@store/slices/modal/modal.actions';
import { scrollBarCSS } from '@styles/css-styles';
import { BitcoinError } from 'dlc-btc-lib/models';
import { Form, Formik } from 'formik';

import { LockScreenProtocolFee } from '../../lock-screen/components/protocol-fee';
import { RiskBox } from '../../risk-box/risk-box';
import { TransactionFormInput } from '../../transaction-form/components/transaction-form-input';
import { TransactionFormWarning } from '../../transaction-form/components/transaction-form-warning';
import { WithdrawalForm } from '../../withdrawal-form /withdrawal-form';

interface UnmintVaultSelectorProps {
  handleSignWithdrawTransaction: (vaultUUID: string, withdrawAmount: number) => Promise<void>;
  risk: string;
  fetchRisk: () => Promise<string>;
  isRiskLoading: boolean;
  isBitcoinWalletLoading: [boolean, string];
}

export interface TransactionFormValues {
  amount: number;
}

const initialValues: TransactionFormValues = { amount: 0.01 };

export function UnmintVaultSelector({
  handleSignWithdrawTransaction,
  risk,
  fetchRisk,
  isRiskLoading,
  isBitcoinWalletLoading,
}: UnmintVaultSelectorProps): React.JSX.Element {
  const toast = useToast();
  const dispatch = useDispatch();

  const { bitcoinWalletContextState } = useContext(BitcoinWalletContext);

  const { bitcoinPrice } = useContext(ProofOfReserveContext);
  const { fundedVaults } = useVaults();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { unmintStep } = useSelector((state: RootState) => state.mintunmint);

  const [selectedVault, setSelectedVault] = useState<Vault | undefined>();

  const [buttonText, setButtonText] = useState('Select Bitcoin Wallet');

  function handleSelect(uuid: string): void {
    const vault = fundedVaults.find(vault => vault.uuid === uuid);
    if (vault) setSelectedVault(vault);
  }

  useEffect(() => {
    switch (bitcoinWalletContextState) {
      case BitcoinWalletContextState.INITIAL:
        setButtonText('Connect Bitcoin Wallet');
        break;
      case BitcoinWalletContextState.READY:
        setButtonText('Sign Withdrawal Transaction');
        break;
      default:
        setButtonText('Connect Bitcoin Wallet');
        break;
    }
  }, [bitcoinWalletContextState]);

  useEffect(() => {
    setSelectedVault(fundedVaults.find(vault => vault.uuid === unmintStep[1]));
  }, [fundedVaults, unmintStep]);

  async function handleWithdraw(bitcoinWithdrawalAmount: number): Promise<void> {
    if (selectedVault) {
      try {
        setIsSubmitting(true);
        const currentRisk = await fetchRisk();
        if (currentRisk === 'High') throw new Error('Risk Level is too high');
        await handleSignWithdrawTransaction(selectedVault.uuid, bitcoinWithdrawalAmount);
      } catch (error) {
        setIsSubmitting(false);
        toast({
          title: 'Failed to sign transaction',
          description: error instanceof Error ? error.message : '',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }

  async function handleConnect() {
    dispatch(modalActions.toggleSelectBitcoinWalletModalVisibility());
  }

  return (
    <>
      {selectedVault ? (
        <VStack w={'45%'}>
          <Formik
            initialValues={initialValues}
            onSubmit={async values => {
              if (bitcoinWalletContextState === BitcoinWalletContextState.READY) {
                await handleWithdraw(values.amount);
              } else {
                await handleConnect();
              }
            }}
          >
            {({ handleSubmit, errors, touched, values }) => (
              <Form onSubmit={handleSubmit}>
                <FormControl isInvalid={!!errors.amount && touched.amount}>
                  <VStack w={'385px'} spacing={'16.5px'} h={'456.5px'}>
                    <VaultMiniCard vault={selectedVault} />
                    <TransactionFormInput values={values} bitcoinPrice={bitcoinPrice} />
                    <FormErrorMessage m={'0px'} fontSize={'xs'}>
                      {errors.amount}
                    </FormErrorMessage>
                    <LockScreenProtocolFee
                      assetAmount={values.amount}
                      bitcoinPrice={bitcoinPrice}
                      protocolFeePercentage={selectedVault?.btcRedeemFeeBasisPoints}
                    />
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
                    <Button
                      isLoading={isSubmitting}
                      variant={'account'}
                      type={'submit'}
                      isDisabled={Boolean(errors.amount) || !selectedVault || risk === 'High'}
                    >
                      {buttonText}
                    </Button>
                    <Button
                      isLoading={isSubmitting}
                      variant={'navigate'}
                      onClick={() => setSelectedVault(undefined)}
                    >
                      Cancel
                    </Button>
                  </VStack>
                </FormControl>
              </Form>
            )}
          </Formik>
        </VStack>
      ) : fundedVaults.length == 0 ? (
        <VStack w={'45%'}>
          <Text color={'white'}>You don't have any active vaults.</Text>
        </VStack>
      ) : (
        <VStack w={'45%'}>
          <Text color={'accent.lightBlue.01'} fontSize={'md'} fontWeight={600}>
            Select vault to redeem dlcBTC:
          </Text>
          <VaultsList height={'425.5px'} isScrollable={!selectedVault}>
            <VaultsListGroupContainer
              vaults={fundedVaults}
              isSelectable
              handleSelect={handleSelect}
            />
          </VaultsList>
        </VStack>
      )}
      {risk === 'High' && <RiskBox risk={risk} isRiskLoading={isRiskLoading} />}
    </>
  );
}
