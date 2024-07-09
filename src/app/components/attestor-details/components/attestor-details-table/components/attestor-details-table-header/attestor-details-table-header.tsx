import { HStack } from '@chakra-ui/react';

interface AttestorDetailsTableHeaderProps {
  children: React.ReactNode;
}

export function AttestorDetailsTableHeader({
  children,
}: AttestorDetailsTableHeaderProps): React.JSX.Element {
  return (
    <HStack w={'98%'} px={'10px'} justifyContent={'space-between'}>
      {children}
    </HStack>
  );
}
