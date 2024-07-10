import { HStack, Image, Text } from '@chakra-ui/react';
import { CustomSkeleton } from '@components/custom-skeleton/custom-skeleton';
import { unshiftValue } from 'dlc-btc-lib/utilities';

import { formatNumber } from '@shared/utils';

export interface PointsTableItemProps {
  name: string;
  points: number;
  currentDLCBTC: number;
  multiplier: number;
}

export function PointsTableItem(pointsTableItem: PointsTableItemProps): React.JSX.Element {
  if (!pointsTableItem) return <CustomSkeleton height={'35px'} />;

  const { name, points, currentDLCBTC, multiplier } = pointsTableItem;

  return (
    <HStack
      p={'10px'}
      w={'100%'}
      h={'50px'}
      bg={'background.container.01'}
      blendMode={'screen'}
      border={'1px solid'}
      borderRadius={'md'}
      borderColor={'border.white.01'}
      justifyContent={'space-between'}
    >
      <HStack w={'25%'}>
        <Image src={'/images/logos/dlc-btc-logo.svg'} alt={'dlc BTC logo'} boxSize={'25px'} />
        <Text color={'white'} fontSize={'sm'} fontWeight={800}>
          {unshiftValue(currentDLCBTC)}
        </Text>
      </HStack>
      <HStack w={'50%'}>
        <Text color={'white'} fontSize={'sm'} fontWeight={800}>
          {`${formatNumber(points)} Points`}
        </Text>
        <Text
          bgGradient={`linear(to-r, #AC50EF, #7059FB, #2ECFF6)`}
          bgClip="text"
          fontSize={'sm'}
          fontWeight={800}
        >
          {`(${multiplier}x)`}
        </Text>
      </HStack>
      <Text w={'20%'} color={'white'} fontSize={'sm'}>
        {name}
      </Text>
    </HStack>
  );
}
