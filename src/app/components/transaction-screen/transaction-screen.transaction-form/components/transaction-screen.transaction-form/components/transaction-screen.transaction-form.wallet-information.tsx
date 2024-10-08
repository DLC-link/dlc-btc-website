import { HStack, Text } from '@chakra-ui/react';
import { orangeBoxShadowAnimation } from '@styles/css-styles';

interface TransactionScreenWalletInformationProps {
  isBitcoinWalletLoading: [boolean, string];
}

export function TransactionScreenWalletInformation({
  isBitcoinWalletLoading,
}: TransactionScreenWalletInformationProps): React.JSX.Element | false {
  if (!isBitcoinWalletLoading[0]) return false;
  return (
    <HStack
      p={'15px'}
      w={'100%'}
      bgColor={'background.content.01'}
      justifyContent={'space-between'}
      border={'2px solid transparent'}
      borderRadius={'md'}
      css={{
        animation: `${orangeBoxShadowAnimation} 1.5s infinite ease-in-out`,
      }}
    >
      <HStack w={'100%'}>
        <Text fontSize={'sm'} color={'white.01'}>
          {isBitcoinWalletLoading[1]}
        </Text>
      </HStack>
    </HStack>
  );
}
