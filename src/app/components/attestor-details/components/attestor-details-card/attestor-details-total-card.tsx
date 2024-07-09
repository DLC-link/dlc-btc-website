import { VStack } from '@chakra-ui/react';

interface AttestorDetailsTotalCardProps {
  children: React.ReactNode;
}

export function AttestorDetailsTotalCard({
  children,
}: AttestorDetailsTotalCardProps): React.JSX.Element {
  return (
    <VStack h={'100%'} alignItems={'flex-start'}>
      {children}
    </VStack>
  );
}
