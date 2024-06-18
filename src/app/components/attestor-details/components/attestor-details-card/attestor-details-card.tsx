import { HStack } from '@chakra-ui/react';

interface AttestorDetailsCardProps {
  children: React.ReactNode;
}

export function AttestorDetailsCard({ children }: AttestorDetailsCardProps): React.JSX.Element {
  return <HStack spacing={'20px'}>{children}</HStack>;
}
