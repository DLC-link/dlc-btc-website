/* eslint-disable */
import { HStack, Image, Text } from '@chakra-ui/react';
import { CustomSkeleton } from '@components/custom-skeleton/custom-skeleton';

interface AttestorDetailsTableItem {
  node: string;
  observedResponse: string;
  totalStake: number;
  del: number;
  fee: string;
  ownerRewards: number;
  maxYield: string;
  startDate: string;
}

export function AttestorDetailsTableItem(
  attestorDetailsTableItem: AttestorDetailsTableItem
): React.JSX.Element {
  if (!attestorDetailsTableItem) return <CustomSkeleton height={'35px'} />;

  const { node, observedResponse, totalStake, del, fee, ownerRewards, maxYield, startDate } =
    attestorDetailsTableItem;

  return (
    <HStack
      p={'10px'}
      w={'100%'}
      h={'50px'}
      bg={'background.content.01'}
      blendMode={'screen'}
      border={'1px solid'}
      borderRadius={'md'}
      borderColor={'border.white.01'}
      justifyContent={'space-between'}
    >
      <HStack w={'20%'}>
        <Image src={'/images/logos/dlc-btc-logo.svg'} alt={'dlcBTC Logo'} boxSize={'30px'} />
        <Text color={'white'} fontSize={'sm'} fontWeight={500}>
          {node}
        </Text>
      </HStack>
      <Text
        w={'15%'}
        color={observedResponse === 'GOOD' ? 'green' : 'red'}
        fontSize={'sm'}
        fontWeight={800}
      >
        {observedResponse}
      </Text>
      <Text w={'10%'} color={'white'} fontSize={'sm'}>
        {totalStake}
      </Text>
      <Text w={'5%'} color={'white'} fontSize={'sm'}>
        {del}
      </Text>
      <Text w={'5%'} color={'white'} fontSize={'sm'}>
        {fee}
      </Text>
      <Text w={'10%'} color={'white'} fontSize={'sm'}>
        {ownerRewards}
      </Text>
      <Text w={'10%'} color={'white'} fontSize={'sm'}>
        {maxYield}
      </Text>
      <Text w={'15%'} color={'white'} fontSize={'sm'}>
        {startDate}
      </Text>
    </HStack>
  );
}
