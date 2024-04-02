import { HStack, Image, Input, Text, VStack } from '@chakra-ui/react';
import { Field } from 'formik';

import { TransactionFormValues } from '../transaction-form';

function validateTokenAmount(value: number): string | undefined {
  let error;
  if (!value) {
    error = 'Please enter an amount of dlcBTC you would like to mint';
  } else if (value < 0.0001) {
    error = "You can't mint less than 0.0001 dlcBTC";
  }
  return error;
}

interface TransactionFormInputProps {
  values: TransactionFormValues;
  bitcoinPrice?: number;
}

export function TransactionFormInput({
  values,
  bitcoinPrice,
}: TransactionFormInputProps): React.JSX.Element {
  return (
    <VStack
      alignItems={'start'}
      py={'5px'}
      px={'15px'}
      w={'100%'}
      bgColor={'white.01'}
      border={'2.5px solid'}
      borderRadius={'md'}
      borderColor={'border.lightBlue.01'}
    >
      <HStack>
        <Image src={'/images/logos/dlc-btc-logo.svg'} alt={'dlcBTC'} boxSize={'20px'} />
        <Field
          autoFocus
          name="amount"
          as={Input}
          type="number"
          px={'1.5px'}
          h={'25px'}
          w={'75px'}
          borderColor={'white.01'}
          focusBorderColor={'white.01'}
          fontSize={'xl'}
          fontWeight={800}
          validate={validateTokenAmount}
          onWheel={(e: React.WheelEvent<HTMLInputElement>) => (e.target as HTMLInputElement).blur()}
        />
        <Text fontSize={'xl'}>dlcBTC</Text>
      </HStack>
      <Text pl={'30px'} color={'gray'} fontSize={'sm'}>
        {bitcoinPrice && `= ~${(values.amount * bitcoinPrice).toFixed(4)}$`}
      </Text>
    </VStack>
  );
}
