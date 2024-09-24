import { HStack, Text, keyframes } from '@chakra-ui/react';

const borderColorKeyframes = keyframes`
  0% { border-color: rgba(255, 168, 0, 0.11); }
  25% { border-color: rgba(255, 168, 0, 0.3); }
  50% { border-color: rgba(255, 168, 0, 0.5); }
  75% { border-color: rgba(255, 168, 0, 0.7); }
  100% { border-color: rgba(255, 168, 0, 0.1); }
`;

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
      border={'1px solid'}
      borderRadius={'md'}
      animation={`${borderColorKeyframes} 2s linear infinite`}
    >
      <HStack w={'100%'}>
        <Text fontSize={'sm'} color={'white.01'}>
          {isBitcoinWalletLoading[1]}
        </Text>
      </HStack>
    </HStack>
  );
}
