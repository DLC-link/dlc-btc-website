import { VStack } from '@chakra-ui/react';
import { scrollBarCSS } from '@styles/css-styles';

interface AttestorDetailsTableBodyProps {
  children: React.ReactNode;
}

export function AttestorDetailsTableBody({
  children,
}: AttestorDetailsTableBodyProps): React.JSX.Element {
  return (
    <VStack
      w={'100%'}
      pb={'15px'}
      pr={'15px'}
      overflowY={'scroll'}
      overflowX={'hidden'}
      css={scrollBarCSS}
    >
      {children}
    </VStack>
  );
}
