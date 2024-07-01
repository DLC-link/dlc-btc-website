import { VStack } from '@chakra-ui/react';

interface TokenStatsBoardLayoutProps {
  children: React.ReactNode;
  width?: string;
}

export function TokenStatsBoardLayout({
  children,
  width = '100%',
}: TokenStatsBoardLayoutProps): React.JSX.Element {
  return (
    <VStack
      w={width}
      h={'auto'}
      p={'15px'}
      justifyContent={'center'}
      borderRadius={'md'}
      bg={'background.container.01'}
      alignItems={'flex-start'}
      border={'1px'}
      borderColor={'white.03'}
    >
      {children}
    </VStack>
  );
}
