import { VStack } from '@chakra-ui/react';

interface TokenStatsBoardLayoutProps {
  children: React.ReactNode;
  height: string;
}

export function TokenStatsBoardLayout({
  children,
  height,
}: TokenStatsBoardLayoutProps): React.JSX.Element {
  return (
    <VStack
      w={'1280px'}
      h={height}
      p={'25px'}
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
