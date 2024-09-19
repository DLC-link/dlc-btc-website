import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, HStack, Image, Skeleton, Text } from '@chakra-ui/react';
import { Merchant } from '@models/merchant';

interface MerchantTableItemProps {
  merchant: Merchant;
  dlcBTCAmount: number | undefined;
}

export function MerchantTableItem({
  merchant,
  dlcBTCAmount,
}: MerchantTableItemProps): React.ReactElement {
  const navigate = useNavigate();

  return (
    <HStack w={'100%'} justifyContent={'space-between'} py={'5px'}>
      <HStack w={'250px'}>
        <Image src={merchant.logo} alt={merchant.name} width={'150px'} />
      </HStack>
      <HStack w={'150px'} h={'35px'}>
        <Image src={'/images/logos/dlc-btc-logo.svg'} alt={'dlcBTC Logo'} boxSize={'25px'} />
        <Skeleton isLoaded={dlcBTCAmount !== undefined} h={'auto'} w={'150px'}>
          <Text color={'white'} fontSize={'2xl'} fontWeight={800} h={'35px'}>
            {Number(dlcBTCAmount?.toFixed(4))}
          </Text>
        </Skeleton>
      </HStack>
      <Button
        w={'150px'}
        variant={'merchantTableItem'}
        onClick={() => navigate(`/merchant-details/${merchant.name}`)}
      >
        <Text color={'white.01'} fontSize={'xs'}>
          Mint/Withdraw History
        </Text>
      </Button>
    </HStack>
  );
}
