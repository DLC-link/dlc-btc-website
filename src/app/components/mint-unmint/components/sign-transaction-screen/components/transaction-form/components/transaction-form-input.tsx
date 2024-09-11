import { HStack, Image, Input, Text, VStack } from '@chakra-ui/react';
import { Field } from 'formik';

interface TransactionFormInputProps {
  header: string;
  type: 'mint' | 'burn';
  values: { amount: number };
  depositLimit?: { minimumDeposit: number; maximumDeposit: number } | undefined;
  bitcoinPrice?: number;
  lockedAmount?: number;
}

export function TransactionFormInput({
  header,
  values,
  type,
  depositLimit,
  bitcoinPrice,
  lockedAmount,
}: TransactionFormInputProps): React.JSX.Element {
  function validateDepositAmount(value: number): string | undefined {
    let error;

    if (!value) {
      error = 'Please enter a valid amount of dlcBTC';
    } else if (depositLimit && value < depositLimit.minimumDeposit) {
      error = `You can't mint less than ${depositLimit.minimumDeposit} dlcBTC`;
    } else if (depositLimit && value > depositLimit.maximumDeposit) {
      error = `You can't mint more than ${depositLimit.maximumDeposit} dlcBTC`;
    }
    return error;
  }

  function validateWithdrawAmount(value: number): string | undefined {
    let error;

    if (!value) {
      error = 'Please enter a valid amount of dlcBTC';
    } else if (lockedAmount && value > lockedAmount) {
      error = `You can't burn more than ${lockedAmount} dlcBTC`;
    }
    return error;
  }

  return (
    <VStack
      alignItems={'start'}
      p={'7.5px'}
      w={'100%'}
      spacing={'10px'}
      bg={'background.content.01'}
      blendMode={'screen'}
      border={'1px solid'}
      borderColor={'border.white.01'}
      borderRadius={'md'}
    >
      <Text w={'100%'} pl={'9.5%'} color={'accent.lightBlue.01'}>
        {header}
      </Text>
      <HStack w={'100%'} justifyContent={'space-between'}>
        <HStack>
          <Image src={'/images/logos/dlc-btc-logo.svg'} alt={'dlcBTC'} boxSize={'25px'} />
          <Field
            autoFocus
            name="amount"
            as={Input}
            type="number"
            px={'1.5px'}
            h={'25px'}
            w={'235px'}
            bgColor={'white.01'}
            borderColor={'accent.lightBlue.01'}
            fontSize={'lg'}
            fontWeight={800}
            validate={type === 'mint' ? validateDepositAmount : validateWithdrawAmount}
            onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
              (e.target as HTMLInputElement).blur()
            }
          />
        </HStack>
        <Text fontSize={'sm'} color={'white.01'}>
          dlcBTC
        </Text>
      </HStack>
      <Text pl={'9.5%'} color={'white.02'} fontSize={'xs'}>
        {bitcoinPrice && `~ ${Math.floor(values.amount * bitcoinPrice).toLocaleString('en-US')} $`}
      </Text>
    </VStack>
  );
}
