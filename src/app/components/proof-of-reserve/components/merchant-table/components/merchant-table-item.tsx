import React from 'react';
import { useSelector } from 'react-redux';

import { Button, HStack, Image, Skeleton, Text } from '@chakra-ui/react';
import { ethereumArbSepolia, ethereumArbitrum } from '@models/ethereum-network';
import { Merchant } from '@models/merchant';
import { RootState } from '@store/index';

interface MerchantTableItemProps {
  merchant: Merchant;
  dlcBTCAmount: number | undefined;
}

function openMerchantLink(ethereumNetworkName: string, merchantAddress: string): void {
  let link;
  switch (ethereumNetworkName) {
    case ethereumArbitrum.name:
      link = `https://arbiscan.io/address/${merchantAddress}`;
      break;
    case ethereumArbSepolia.name:
      link = `https://sepolia.arbiscan.io/address/${merchantAddress}`;
      break;
  }
  window.open(link, '_blank');
}

export function MerchantTableItem({
  merchant,
  dlcBTCAmount,
}: MerchantTableItemProps): React.ReactElement {
  //TODO: replace name with logo when the logo is available
  const { name } = merchant;

  const { network } = useSelector((state: RootState) => state.account);
  return (
    <HStack px={'25px'} w={'100%'}>
      <Text
        w={'33.3%'}
        fontSize={'2xl'}
        fontWeight={600}
        bgGradient={`linear(to-r, #AC50EF, #7059FB, #2ECFF6)`}
        bgClip="text"
      >
        {name}
      </Text>
      <HStack w={'33.3%'} h={'35px'}>
        <Image src={'/images/logos/dlc-btc-logo.svg'} alt={'dlcBTC Logo'} boxSize={'25px'} />
        <Skeleton isLoaded={dlcBTCAmount !== undefined} h={'auto'} w={'33.3%'}>
          <Text color={'white'} fontSize={'2xl'} fontWeight={800} h={'35px'}>
            {dlcBTCAmount}
          </Text>
        </Skeleton>
      </HStack>
      <Button
        variant={'merchantTableItem'}
        onClick={() => openMerchantLink(network.name, merchant.address)}
      >
        <Text color={'white.01'} fontSize={'sm'}>
          Mint/Redeem History
        </Text>
      </Button>
    </HStack>
  );
}
