import { VStack } from '@chakra-ui/react';

interface AttestorDetailsCardLayoutProps {
  children: React.ReactNode;
  width: string;
}

export function AttestorDetailsCardLayout({
  children,
  width,
}: AttestorDetailsCardLayoutProps): React.JSX.Element {
  return (
    <VStack
      w={width}
      h={'270px'}
      p={'20px'}
      borderRadius={'md'}
      bg={'background.container.01'}
      border={'1px'}
      borderColor={'white.03'}
      align={'stretch'}
      justifyContent={'center'}
    >
      {children}
    </VStack>
  );
}
