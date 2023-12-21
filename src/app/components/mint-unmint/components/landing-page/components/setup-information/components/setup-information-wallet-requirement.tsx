import { HStack, Image, Text, VStack } from '@chakra-ui/react';

interface SetupInformationWalletRequirementProps {
  logo: string;
  color: string;
  walletName: string;
  requirement: string;
  url: string;
}

export function SetupInformationWalletRequirement({
  logo,
  color,
  walletName,
  requirement,
  url,
}: SetupInformationWalletRequirementProps): React.JSX.Element {
  return (
    <VStack pt={'5px'} w={'100%'} spacing={'0.5px'}>
      <HStack alignContent={'start'} w={'100%'}>
        <Image src={logo} h={'15px'}></Image>
        <Text
          color={color}
          fontWeight={'regular'}
          textDecoration={'underline'}
          onClick={() => window.open(url, '_blank')}
          _hover={{ cursor: 'pointer' }}
        >
          {walletName}
        </Text>
      </HStack>
      <Text align={'start'} color={'white'} w={'100%'}>
        {requirement}
      </Text>
    </VStack>
  );
}
