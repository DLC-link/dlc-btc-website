import { Divider, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { dlcBTC } from '@models/token';

interface AttestorDetailsRateCardContentProps {
  width: string;
}

export function AttestorDetailsRateCardContent({
  width,
}: AttestorDetailsRateCardContentProps): React.JSX.Element {
  return (
    <VStack alignItems={'flex-start'}>
      <HStack>
        <VStack width={width} alignItems={'flex-start'}>
          <Text color={'white'} fontWeight={'600'}>
            Nakamoto Coefficient
          </Text>
          <HStack>
            <Image src={dlcBTC.logo} alt={dlcBTC.logoAlt} boxSize={'25px'} />
            <Text color={'grey'}>dlcBTC</Text>
            <Text color={'white'}>7</Text>
          </HStack>
          <Divider />
        </VStack>
        <Divider orientation={'vertical'} px={'1px'} height={'75px'} />
        <VStack width={width} alignItems={'flex-start'}>
          <Text color={'white'} fontWeight={'600'}>
            Weighted Skip Rate
          </Text>
          <Text color={'white'}>3.18%</Text>
          <Divider />
        </VStack>
      </HStack>

      <Text color={'white'} fontWeight={'600'}>
        Nominal Staking APY
      </Text>
    </VStack>
  );
}
