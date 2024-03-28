import React from 'react';

import { Button, HStack, Image, Text } from '@chakra-ui/react';
import { Merchant } from '@models/merchant';

interface MerchantTableItemProps {
  merchant: Merchant;
  dlcBTCAmount: number;
}

export function MerchantTableItem({
  merchant,
  dlcBTCAmount,
}: MerchantTableItemProps): React.ReactElement {
  //TODO: replace name with logo when the logo is available
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { name, logo } = merchant;

  return (
    <HStack px={'25px'} w={'100%'}>
      <Text w={'33.3%'} color={'white'} fontSize={'2xl'} fontWeight={800}>
        {name}
      </Text>
      <HStack w={'33.3%'}>
        <Image src={'/images/logos/dlc-btc-logo.svg'} alt={'dlcBTC Logo'} boxSize={'25px'} />
        <Text color={'white'} fontSize={'2xl'} fontWeight={800}>
          {dlcBTCAmount}
        </Text>
      </HStack>
      <Button w={'33.3%'} variant={'merchantHistory'}>
        Mint/Redeem History
      </Button>
    </HStack>
  );
}
