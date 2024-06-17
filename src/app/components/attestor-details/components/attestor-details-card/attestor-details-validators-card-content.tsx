import { Divider, HStack, Text, VStack } from '@chakra-ui/react';

export function AttestorDetailsValidatorsCardContent(): React.JSX.Element {
  return (
    <VStack alignItems={'flex-start'} align={'stretch'}>
      <Text color={'white'} fontWeight={'600'}>
        Active Validators
      </Text>
      <HStack alignItems={'baseline'} paddingBottom={'15px'}>
        <Text
          fontSize={'4xl'}
          fontWeight={600}
          bgGradient={`linear(to-r, #AC50EF, #7059FB, #2ECFF6)`}
          bgClip="text"
        >
          1478
        </Text>
        <Text color={'white.03'}>(30.82%)</Text>
      </HStack>
      <Divider />
      <Text color={'white'} fontWeight={'600'} paddingTop={'20px'}>
        Non-Vote Validators
      </Text>
      <HStack alignItems={'baseline'}>
        <Text color={'white'} fontSize={'4xl'} fontWeight={600}>
          3463
        </Text>
        <Text color={'white.03'}>(60.18%)</Text>
      </HStack>
    </VStack>
  );
}
