/* eslint-disable */
import { HStack, Image, Text } from '@chakra-ui/react';
import { easyTruncateAddress } from '@common/utilities';
import { CustomSkeleton } from '@components/custom-skeleton/custom-skeleton';

interface ProtocolHistoryItem {
  id: number;
  merchant: string;
  dlcBTCAmount: number;
  btcReserve: string;
  date: string;
}

export function ProtocolHistoryItem(protocolHistoryItem: ProtocolHistoryItem): React.JSX.Element {
  if (!protocolHistoryItem) return <CustomSkeleton height={'35px'} />;

  const { merchant, dlcBTCAmount, btcReserve, date } = protocolHistoryItem;

  return (
    <HStack
      p={'10px'}
      w={'100%'}
      h={'35px'}
      bg={'background.content.01'}
      blendMode={'screen'}
      border={'1px solid'}
      borderRadius={'md'}
      borderColor={'border.white.01'}
    >
      <HStack w={'25%'}>
        <Image src={'/images/logos/dlc-btc-logo.svg'} alt={'dlcBTC Logo'} boxSize={'20px'} />
        <Text color={'white'} fontWeight={800}>
          {dlcBTCAmount}
        </Text>
      </HStack>
      <Text w={'25%'} color={'white'} fontSize={'sm'} fontWeight={800}>
        {merchant}
      </Text>
      <Text w={'25%'} color={'white'} fontSize={'sm'}>
        {easyTruncateAddress(btcReserve)}
      </Text>
      <Text w={'25%'} color={'white'} fontSize={'sm'}>
        {date}
      </Text>
    </HStack>
  );
}