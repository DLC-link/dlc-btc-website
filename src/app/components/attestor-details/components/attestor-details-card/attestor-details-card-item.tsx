import { Text, VStack } from '@chakra-ui/react';

interface AttestorDetailsCardItemProps {
  label: string;
  children: React.ReactNode;
}

export function AttestorDetailsCardItem({
  label,
  children,
}: AttestorDetailsCardItemProps): React.JSX.Element {
  return (
    <VStack h={'100%'} alignItems={'flex-start'} spacing={'10%'}>
      <Text color={'white'} fontWeight={'600'}>
        {label}
      </Text>
      {children}
    </VStack>
  );
}
