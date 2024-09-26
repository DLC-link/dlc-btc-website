import { Text } from '@chakra-ui/react';
import { ValidationError } from '@tanstack/react-form';
import Decimal from 'decimal.js';

interface TransactionFormInputUSDTextProps {
  errors: ValidationError[];
  assetAmount?: string;
  currentBitcoinPrice?: number;
}

export function TransactionFormInputUSDText({
  errors,
  assetAmount,
  currentBitcoinPrice,
}: TransactionFormInputUSDTextProps): React.JSX.Element | false {
  if (errors.length) return false;

  return (
    <Text w={'100%'} pl={'12.5%'} color={'white.02'} fontSize={'xs'}>
      {`~ $${assetAmount && currentBitcoinPrice ? new Decimal(assetAmount).mul(currentBitcoinPrice).toNumber().toLocaleString('en-US') : 0} USD`}
    </Text>
  );
}
