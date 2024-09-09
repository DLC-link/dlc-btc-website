import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, HStack, Image, Skeleton, Text } from '@chakra-ui/react';
import { Merchant } from '@models/merchant';
import { unshiftValue } from 'dlc-btc-lib/utilities';

interface MerchantTableItemProps {
  merchant: Merchant;
  dlcBTCAmount: number | undefined;
}

export function MerchantTableItem({
  merchant,
  dlcBTCAmount,
}: MerchantTableItemProps): React.ReactElement {
  //TODO: replace name with logo when the logo is available
  const { name } = merchant;
  const navigate = useNavigate();

  return (
    <HStack w={'100%'} justifyContent={'space-between'}>
      <HStack w={'250px'}>
        <Text
          fontSize={'2xl'}
          fontWeight={600}
          bgGradient={`linear(to-r, #AC50EF, #7059FB, #2ECFF6)`}
          bgClip="text"
        >
          {name}
        </Text>
      </HStack>
      <HStack w={'150px'} h={'35px'}>
        <Image src={'/images/logos/dlc-btc-logo.svg'} alt={'dlcBTC Logo'} boxSize={'25px'} />
        <Skeleton isLoaded={dlcBTCAmount !== undefined} h={'auto'} w={'150px'}>
          <Text color={'white'} fontSize={'2xl'} fontWeight={800} h={'35px'}>
            {dlcBTCAmount && unshiftValue(dlcBTCAmount)}
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
