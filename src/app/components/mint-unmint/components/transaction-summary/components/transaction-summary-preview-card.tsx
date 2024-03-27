import { HStack, Image, Text, VStack } from '@chakra-ui/react';

const blockchainPreviewCardMap = {
  ethereum: {
    tokenName: 'dlcBTC',
    path: '/images/logos/dlc-btc-logo.svg',
  },
  bitcoin: {
    tokenName: 'BTC',
    path: '/images/logos/bitcoin-logo.svg',
  },
};

interface TransactionSummaryPreviewCardProps {
  blockchain: 'ethereum' | 'bitcoin';
  assetAmount?: number;
}

export function TransactionSummaryPreviewCard({
  blockchain,
  assetAmount,
}: TransactionSummaryPreviewCardProps): React.JSX.Element {
  return (
    <VStack
      justifyContent={'center'}
      alignItems={'start'}
      p={'7.5px'}
      h={'50px'}
      w={'100%'}
      bg={'background.content.01'}
      blendMode={'screen'}
      border={'1px solid'}
      borderColor={'border.white.01'}
      borderRadius={'md'}
    >
      <HStack spacing={'15px'}>
        <Image src={blockchainPreviewCardMap[blockchain].path} alt={'dlcBTC'} boxSize={'25px'} />
        <Text color={'white'} fontWeight={800}>
          {assetAmount} {blockchainPreviewCardMap[blockchain].tokenName}
        </Text>
      </HStack>
    </VStack>
  );
}
