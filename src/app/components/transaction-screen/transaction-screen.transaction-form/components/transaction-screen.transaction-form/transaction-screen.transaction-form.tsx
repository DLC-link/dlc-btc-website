import React, { useState } from 'react';

import { Button, VStack } from '@chakra-ui/react';
import { RiskBox } from '@components/mint-unmint/components/risk-box/risk-box';
import { TransactionFormAPI } from '@models/form.models';
import { Vault } from '@models/vault';
import { BitcoinWalletContextState } from '@providers/bitcoin-wallet-context-provider';
import { useForm } from '@tanstack/react-form';
import Decimal from 'decimal.js';

import { formPropertyMap } from './components/transaction-screen.transaction-form.input-field';
import { TransactionFormProgressStackBurnVariantA } from './components/transaction-screen.transaction-form.progress-stack/components/transaction-screen.transaction-form.progress-stack.burn-variant-a';
import { TransactionFormProgressStackBurnVariantB } from './components/transaction-screen.transaction-form.progress-stack/components/transaction-screen.transaction-form.progress-stack.burn-variant-b';
import { TransactionFormProgressStackBurnVariantC } from './components/transaction-screen.transaction-form.progress-stack/components/transaction-screen.transaction-form.progress-stack.burn-variant-c';
import { TransactionFormProgressStackMintVariantA } from './components/transaction-screen.transaction-form.progress-stack/components/transaction-screen.transaction-form.progress-stack.mint-variant-a';
import { TransactionFormProgressStackMintVariantB } from './components/transaction-screen.transaction-form.progress-stack/components/transaction-screen.transaction-form.progress-stack.mint-variant-b';
import { TransactionFormProgressStackMintVariantC } from './components/transaction-screen.transaction-form.progress-stack/components/transaction-screen.transaction-form.progress-stack.mint-variant-c';
import { TransactionFormProtocolFeeStack } from './components/transaction-screen.transaction-form.protocol-fee-box';
import { TransactionScreenWalletInformation } from './components/transaction-screen.transaction-form.wallet-information';
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
  type: 'mint' | 'burn',
  depositLimit?: { minimumDeposit: number; maximumDeposit: number },
  vault?: Vault
): string | undefined {
  console.log('value', value);
  if (!vault) {
    return 'Vault is not available';
  } else if (!depositLimit) {
    return 'Deposit limits are not available';
  }

  switch (type) {
    case 'mint':
      return validateDepositAmount(value, depositLimit);
    case 'burn':
      return validateWithdrawAmount(value, vault.valueMinted);
  }
}

function getButtonLabel(
  formType: 'mint' | 'burn',
  currentStep: number,
  isSubmitting: boolean,
  bitcoinWalletContextState: BitcoinWalletContextState
): string {
  if (isSubmitting) return 'Processing';

  if (formType === 'burn') {
    if (currentStep === 0) return 'Sign Burn Transaction';
    return bitcoinWalletContextState === BitcoinWalletContextState.READY
      ? 'Sign Withdraw Transaction'
      : 'Connect Wallet';
  }

  return bitcoinWalletContextState === BitcoinWalletContextState.READY
    ? 'Sign Deposit Transaction'
    : 'Connect Wallet';
}

function getTransactionProgressStack(
  flow: 'mint' | 'burn',
  currentStep: number,
  formAPI: TransactionFormAPI,
  currentBitcoinPrice: number
): React.JSX.Element | undefined {
  switch (flow) {
    case 'mint':
      switch (currentStep) {
        case 1:
          return (
            <TransactionFormProgressStackMintVariantA
              formAPI={formAPI}
              currentBitcoinPrice={currentBitcoinPrice}
            />
          );
        case 2:
          return <TransactionFormProgressStackMintVariantB />;
        case 3:
          return <TransactionFormProgressStackMintVariantC />;
      }
      break;
    case 'burn':
      switch (currentStep) {
        case 0:
          return (
            <TransactionFormProgressStackBurnVariantA
              formAPI={formAPI}
              currentBitcoinPrice={currentBitcoinPrice}
            />
          );
        case 1:
          return <TransactionFormProgressStackBurnVariantB />;
        case 2:
          return <TransactionFormProgressStackBurnVariantC />;
      }
      break;
  }
}

interface VaultTransactionFormProps {
  flow: 'mint' | 'burn';
  currentStep: number;
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
  flow,
  currentStep,
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
  const [currentFieldValue, setCurrentFieldValue] = useState<number>(depositLimit?.minimumDeposit!);
  const form = useForm({
    defaultValues: {
      assetAmount: depositLimit?.minimumDeposit!.toString()!,
    },
    onSubmit: async ({ value }) => {
      const assetAmount = new Decimal(value.assetAmount);
      const burnAmount = new Decimal(vault.valueLocked).minus(vault.valueMinted).toNumber();

      if (flow === 'burn') {
        if (currentStep === 0) {
          await handleButtonClick(assetAmount.toNumber());
        } else {
          await handleButtonClick(burnAmount);
        }
      } else {
        await handleButtonClick(assetAmount.toNumber());
      }
    },
    validators: {
      onChange: ({ value }) => {
        setCurrentFieldValue(new Decimal(value.assetAmount).toNumber());
        return {
          fields: {
            assetAmount: validateFormAmount(
              parseFloat(value.assetAmount),
              flow,
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
        await form.handleSubmit();
      }}
    >
      <VStack
        w={'100%'}
        h={'300px'}
        spacing={'15px'}
        minW={'364.8'}
        justifyContent={'space-between'}
      >
        {getTransactionProgressStack(flow, currentStep, form, currentBitcoinPrice!)}
        <TransactionFormProtocolFeeStack
          formType={flow}
          assetAmount={currentFieldValue}
          bitcoinPrice={currentBitcoinPrice}
          protocolFeeBasisPoints={vault?.btcMintFeeBasisPoints}
          isBitcoinWalletLoading={isBitcoinWalletLoading}
        />
        <TransactionFormTransactionInformation
          formType={flow}
          assetAmount={currentFieldValue}
          isBitcoinWalletLoading={isBitcoinWalletLoading}
        />
        {isUserEthereumAddressRiskLevelLoading && userEthereumAddressRiskLevel && (
          <RiskBox
            risk={userEthereumAddressRiskLevel}
            isRiskLoading={isUserEthereumAddressRiskLevelLoading}
          />
        )}
        <TransactionScreenWalletInformation isBitcoinWalletLoading={isBitcoinWalletLoading} />
        <form.Subscribe
          selector={state => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              w={'100%'}
              p={'25px'}
              fontSize={'lg'}
              color={'white.01'}
              bgColor={formPropertyMap[flow].color}
              _hover={{ bgColor: 'accent.lightBlue.01' }}
              type="submit"
              isDisabled={
                userEthereumAddressRiskLevel
                  ? ['High', 'Severe'].includes(userEthereumAddressRiskLevel) || !canSubmit
                  : !canSubmit
              }
            >
              {getButtonLabel(flow, currentStep, isSubmitting, bitcoinWalletContextState)}
            </Button>
          )}
        />
        <Button
          isLoading={form.state.isSubmitting}
          variant={'navigate'}
          onClick={handleCancelButtonClick}
        >
          Cancel
        </Button>
      </VStack>
    </form>
  );
}
