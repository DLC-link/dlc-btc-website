import { useState } from 'react';

import { Button, HStack, NumberInput, NumberInputField, Text } from '@chakra-ui/react';

interface LedgerModalSelectAddressMenuAccountIndexInputProps {
  walletAccountIndex: number;
  setWalletAccountIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function LedgerModalSelectAddressMenuAccountIndexInput({
  walletAccountIndex,
  setWalletAccountIndex,
}: LedgerModalSelectAddressMenuAccountIndexInputProps): React.JSX.Element {
  const [currentWalletAccountIndex, setCurrentWalletAccountIndex] = useState(walletAccountIndex);

  return (
    <HStack
      w={'100%'}
      py={'5%'}
      justifyContent={'space-between'}
      borderBottom={'1px'}
      borderColor={'white.03'}
    >
      <HStack w={'50%'}>
        <Text fontSize={'xs'}>Account Index:</Text>
      </HStack>
      <NumberInput
        size={'sm'}
        w={'50%'}
        max={100}
        focusBorderColor={'rgba(50, 201, 247,0.75)'}
        defaultValue={walletAccountIndex}
        onChange={walletAccountIndex => setCurrentWalletAccountIndex(Number(walletAccountIndex))}
      >
        <HStack w={'100%'} justifyContent={'end'}>
          <NumberInputField
            autoFocus={true}
            max={100}
            textAlign={'center'}
            p={'0px'}
            w={'35%'}
            h={'25px'}
          />
          <Button
            h={'25px'}
            fontSize={'xs'}
            borderColor={'border.lightBlue.01'}
            variant={'ledgerAccountIndexUpdate'}
            color={'white.01'}
            onClick={() => setWalletAccountIndex(currentWalletAccountIndex)}
          >
            update
          </Button>
        </HStack>
      </NumberInput>
    </HStack>
  );
}
