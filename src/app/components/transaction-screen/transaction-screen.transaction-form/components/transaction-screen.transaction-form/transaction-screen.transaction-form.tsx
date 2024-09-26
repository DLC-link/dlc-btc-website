import { Button, Text, VStack } from '@chakra-ui/react';
import { RiskBox } from '@components/mint-unmint/components/risk-box/risk-box';
import { Vault } from '@models/vault';
import { BitcoinWalletContextState } from '@providers/bitcoin-wallet-context-provider';
import { useForm } from '@tanstack/react-form';
import Decimal from 'decimal.js';

import { TransactionFormFieldInput } from './components/transaction-screen.transaction-form.input';
import { TransactionFormInputUSDText } from './components/transaction-screen.transaction-form.input-usd-text';
import { TransactionFormProtocolFeeStack } from './components/transaction-screen.transaction-form.protocol-fee-box';
import { TransactionScreenWalletInformation } from './components/transaction-screen.transaction-form.wallet-information';
import { VaultTransactionFormWarning } from './components/transaction-screen.transaction-form.warning';
import { TransactionFormTransactionInformation } from './components/transaction-screent.transaction-form.transaction-information';

function validateDepositAmount(
  value: number,
  depositLimit: { minimumDeposit: number; maximumDeposit: number }
): string | undefined {
  let error;

  if (!value) {
    error = 'Please enter a valid amount of BTC';
  } else if (depositLimit && value < depositLimit.minimumDeposit) {
    error = `You can't deposit less than ${depositLimit.minimumDeposit} BTC`;
  } else if (depositLimit && value > depositLimit.maximumDeposit) {
    error = `You can't deposit more than ${depositLimit.maximumDeposit} BTC`;
  }
  return error;
}

function validateWithdrawAmount(value: number, valueMinted: number): string | undefined {
  let error;

  if (!value) {
    error = 'Please enter a valid amount of dlcBTC';
  } else if (valueMinted && value > valueMinted) {
    error = `You can't burn more than ${valueMinted} dlcBTC`;
  }
  return error;
}

function validateFormAmount(
  value: number,
  type: 'deposit' | 'withdraw' | 'burn',
  depositLimit?: { minimumDeposit: number; maximumDeposit: number },
  vault?: Vault
): string | undefined {
  if (!vault) {
    return 'Vault is not available';
  } else if (!depositLimit) {
    return 'Deposit limits are not available';
  }

  switch (type) {
    case 'deposit':
      return validateDepositAmount(value, depositLimit);
    case 'withdraw':
      return validateWithdrawAmount(value, vault.valueMinted);
    case 'burn':
      return undefined;
  }
}

function getButtonLabel(
  formType: 'deposit' | 'withdraw' | 'burn',
  isSubmitting: boolean,
  bitcoinWalletContextState: BitcoinWalletContextState
): string {
  if (isSubmitting) {
    return 'Processing';
  } else if (formType === 'burn') {
    return 'Sign Burn Transaction';
  } else {
    if (bitcoinWalletContextState === BitcoinWalletContextState.READY) {
      switch (formType) {
        case 'deposit':
          return 'Sign Deposit Transaction';
        case 'withdraw':
          return 'Sign Withdraw Transaction';
      }
    } else {
      return 'Connect Wallet';
    }
  }
}

const formPropertyMap = {
  deposit: {
    label: 'Deposit BTC',
    logo: '/images/logos/bitcoin-logo.svg',
    symbol: 'BTC',
    color: 'orange.01',
  },
  withdraw: {
    label: 'Withdraw BTC',
    logo: '/images/logos/bitcoin-logo.svg',
    symbol: 'BTC',
    color: 'orange.01',
  },
  burn: {
    label: 'Burn dlcBTC',
    logo: '/images/logos/dlc-btc-logo.svg',
    symbol: 'dlcBTC',
    color: 'purple.01',
  },
};

interface VaultTransactionFormProps {
  type: 'deposit' | 'withdraw' | 'burn';
  bitcoinWalletContextState: BitcoinWalletContextState;
  isBitcoinWalletLoading: [boolean, string];
  userEthereumAddressRiskLevel?: string;
  isUserEthereumAddressRiskLevelLoading?: boolean;
  vault: Vault;
  handleButtonClick: (assetValue: number) => Promise<void>;
  handleCancelButtonClick: () => void;
  currentBitcoinPrice?: number;
  depositLimit?: { minimumDeposit: number; maximumDeposit: number } | undefined;
}

export function VaultTransactionForm({
  type,
  bitcoinWalletContextState,
  isBitcoinWalletLoading,
  userEthereumAddressRiskLevel,
  isUserEthereumAddressRiskLevelLoading,
  vault,
  handleButtonClick,
  handleCancelButtonClick,
  currentBitcoinPrice,
  depositLimit,
}: VaultTransactionFormProps): React.JSX.Element {
  const {
    Field,
    Subscribe,
    handleSubmit,
    state: {
      isSubmitting,
      values: { assetAmount },
    },
  } = useForm({
    defaultValues: {
      assetAmount: '0.01',
    },
    onSubmit: async ({ value }) => {
      await handleButtonClick(
        type === 'withdraw'
          ? new Decimal(vault.valueLocked).minus(vault.valueMinted).toNumber()
          : new Decimal(value.assetAmount).toNumber()
      );
    },
    validators: {
      onChange: ({ value }) => {
        return {
          fields: {
            assetAmount: validateFormAmount(
              parseFloat(value.assetAmount),
              type,
              depositLimit,
              vault
            ),
          },
        };
      },
    },
  });

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        e.stopPropagation();
        await handleSubmit();
      }}
    >
      <VStack w={'100%'} spacing={'15px'} minW={'364.8'}>
        {type !== 'withdraw' && (
          <Field name={'assetAmount'}>
            {field => (
              <VStack
                w={'100%'}
                p={'15px'}
                bg={'white.04'}
                border={'1px solid'}
                borderColor={'white.03'}
                borderRadius={'md'}
              >
                <Text w={'100%'} fontWeight={'bold'} color={'accent.lightBlue.01'}>
                  {formPropertyMap[type].label}
                </Text>
                <TransactionFormFieldInput
                  assetLogo={formPropertyMap[type].logo}
                  assetSymbol={formPropertyMap[type].symbol}
                  formField={field}
                />
                <TransactionFormInputUSDText
                  errors={field.state.meta.errors}
                  assetAmount={assetAmount}
                  currentBitcoinPrice={currentBitcoinPrice}
                />
                <VaultTransactionFormWarning formErrors={field.state.meta.errors} />
              </VStack>
            )}
          </Field>
        )}
        <TransactionFormProtocolFeeStack
          formType={type}
          assetAmount={new Decimal(assetAmount).toNumber()}
          bitcoinPrice={currentBitcoinPrice}
          protocolFeeBasisPoints={vault?.btcMintFeeBasisPoints}
          isBitcoinWalletLoading={isBitcoinWalletLoading}
        />
        <TransactionFormTransactionInformation
          formType={type}
          assetAmount={new Decimal(assetAmount).toNumber()}
          isBitcoinWalletLoading={isBitcoinWalletLoading}
        />
        {isUserEthereumAddressRiskLevelLoading && userEthereumAddressRiskLevel && (
          <RiskBox
            risk={userEthereumAddressRiskLevel}
            isRiskLoading={isUserEthereumAddressRiskLevelLoading}
          />
        )}
        <TransactionScreenWalletInformation isBitcoinWalletLoading={isBitcoinWalletLoading} />
        <Subscribe
          selector={state => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              w={'100%'}
              p={'25px'}
              fontSize={'lg'}
              color={'white.01'}
              bgColor={formPropertyMap[type].color}
              _hover={{ bgColor: 'accent.lightBlue.01' }}
              type="submit"
              isDisabled={
                userEthereumAddressRiskLevel
                  ? ['High', 'Severe'].includes(userEthereumAddressRiskLevel) || !canSubmit
                  : !canSubmit
              }
            >
              {getButtonLabel(type, isSubmitting, bitcoinWalletContextState)}
            </Button>
          )}
        />
        <Button isLoading={isSubmitting} variant={'navigate'} onClick={handleCancelButtonClick}>
          Cancel
        </Button>
      </VStack>
    </form>
  );
}
