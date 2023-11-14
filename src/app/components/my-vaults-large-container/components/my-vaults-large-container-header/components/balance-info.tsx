import { HStack, Image, Text, VStack } from '@chakra-ui/react';
import { CustomSkeleton } from '@components/custom-skeleton/custom-skeleton';

interface BalanceInfoProps {
  title: string;
  imageSrc: string;
  altText: string;
  number?: number;
}

export function BalanceInfo({
  title,
  imageSrc,
  altText,
  number,
}: BalanceInfoProps): React.JSX.Element {
  return (
    <VStack justifyContent={'center'} alignItems={'start'} w={'35%'} h={'100%'}>
      <Text color={'accent.cyan.01'} fontWeight={'bold'} fontSize={'md'}>
        {title}
      </Text>
      <CustomSkeleton isLoaded={number !== undefined}>
        <HStack>
          <Image src={imageSrc} alt={altText} boxSize={'25px'} />
          <Text color={'white'} fontWeight={'extrabold'} fontSize={'xl'}>
            {number}
          </Text>
        </HStack>
      </CustomSkeleton>
    </VStack>
  );
}
