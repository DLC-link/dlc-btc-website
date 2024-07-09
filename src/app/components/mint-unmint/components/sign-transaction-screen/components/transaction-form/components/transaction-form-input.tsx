import { HStack, Image, Input, Text, VStack } from '@chakra-ui/react';
import { Field } from 'formik';

function validateTokenAmount(value: number): string | undefined {
  let error;
  if (!value) {
    error = 'Please enter a valid amount of dlcBTC';
  } else if (value < 0.01) {
    error = "You can't mint less than 0.01 dlcBTC";
  }
  return error;
}

interface TransactionFormInputProps {
  header: string;
  values: { amount: number };
  bitcoinPrice?: number;
}

export function TransactionFormInput({
  header,
  values,
  bitcoinPrice,
}: TransactionFormInputProps): React.JSX.Element {
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
            validate={validateTokenAmount}
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
