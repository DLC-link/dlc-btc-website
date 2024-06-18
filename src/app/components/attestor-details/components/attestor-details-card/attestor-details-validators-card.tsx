import { Divider, HStack, Text, VStack } from '@chakra-ui/react';

import { AttestorDetailsCardItem } from './attestor-details-card-item';

export function AttestorDetailsValidatorsCard(): React.JSX.Element {
  return (
    <VStack h={'100%'} alignItems={'flex-start'}>
      <AttestorDetailsCardItem
        label={'Active Validators'}
        children={
          <HStack alignItems={'baseline'}>
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
        }
      />
      <Divider />
      <AttestorDetailsCardItem
        label={'Non-Vote Validators'}
        children={
          <HStack alignItems={'baseline'}>
            <Text color={'white'} fontSize={'4xl'} fontWeight={600}>
              3463
            </Text>
            <Text color={'white.03'}>(60.18%)</Text>
          </HStack>
        }
      />
    </VStack>
  );
}
