import { VStack } from '@chakra-ui/react';

interface AttestorDetailsTableBodyProps {
  children: React.ReactNode;
}

export function AttestorDetailsTableBody({
  children,
}: AttestorDetailsTableBodyProps): React.JSX.Element {
  return (
    <VStack w={'100%'} pb={'50px'} pr={'15px'}>
      {children}
    </VStack>
  );
}
