import { Text, VStack } from '@chakra-ui/react';

interface AttestorDetailsActivityCardProps {
  label: string;
  children: React.ReactNode;
}

export function AttestorDetailsActivityCard({
  label,
  children,
}: AttestorDetailsActivityCardProps): React.JSX.Element {
  return (
    <VStack h={'100%'} alignItems={'flex-start'} spacing={'10%'}>
      <Text color={'white'} fontWeight={'600'}>
        {label}
      </Text>
      {children}
    </VStack>
  );
}
