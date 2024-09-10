import { HStack } from '@chakra-ui/react';

interface GenericTableHeaderProps {
  children: React.ReactNode;
}

export function GenericTableHeader({ children }: GenericTableHeaderProps): React.JSX.Element {
  return (
    <HStack w={'100%'} px={'10px'}>
      {children}
    </HStack>
  );
}
