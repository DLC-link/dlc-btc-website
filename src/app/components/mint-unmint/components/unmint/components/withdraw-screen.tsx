import { useState } from 'react';

import { Button, VStack, useToast } from '@chakra-ui/react';
import { useEthereum } from '@hooks/use-ethereum';
import { EthereumError } from '@models/error-types';
import { unshiftValue } from 'dlc-btc-lib/utilities';

interface WithdrawScreenProps {
  withdrawAmount: number;
}

export function WithdrawScreen({ withdrawAmount }: WithdrawScreenProps): React.JSX.Element {
  const toast = useToast();

  const { setupVault } = useEthereum();

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSetup() {
    try {
      setIsSubmitting(true);
      await setupVault();
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: 'Failed to withdraw',
        description: error instanceof EthereumError ? error.message : '',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }

  return (
    <VStack w={'45%'} h={'445px'} justifyContent={'center'}>
      <Button
        isLoading={isSubmitting}
        variant={'account'}
        type={'submit'}
        onClick={() => handleSetup()}
      >
        {`Withdraw ${unshiftValue(Number(withdrawAmount))} BTC`}
      </Button>
    </VStack>
  );
}
